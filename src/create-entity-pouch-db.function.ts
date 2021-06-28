import { CompositeEntityActionPayload } from "entity-store/src/models";
import { concatMap, filter, switchMap } from "rxjs/operators";
import { BehaviorSubject, of, Subject, timer } from "rxjs";
import {
    createCloseDbTimer,
    dispatch$,
    get$,
    initialize$,
    processRequest$,
    runMigrations$,
    tryPush
} from "./functions";
import {
    CompositeEntityQuery,
    CompositeEntityQueryResult,
    DbConnectionInfo,
    EntityDb,
    EntityPouchDbPayload,
    MigrationEntities,
    ScheduledRequest
} from "./models";
import { Many, Mutable } from "data-modeling";
import { entityPouchDbConfig } from "./constants";
import { startRequest$ } from "./functions/start-request$.function";
import { finalizeRequest$ } from "./functions/finalize-request$.function";
import { ofNull } from "./functions/of-null.function";

export function createEntityPouchDb<TEntityTypeMap extends MigrationEntities>(
    payload: EntityPouchDbPayload<TEntityTypeMap>,
    config = entityPouchDbConfig
): EntityDb<TEntityTypeMap> {

    const dbRef = payload.dbRef;
    const entityTypes = payload.entityTypes as Mutable<Many<string>>;
    tryPush(entityTypes, "migrationInfo");
    const migrations = payload.migrations ? payload.migrations : [];

    const currentDbInstance$ = new BehaviorSubject<DbConnectionInfo>(null);

    const closeDbTimer$ = createCloseDbTimer();

    if (typeof dbRef === "function") {
        /**
         * Register close timer
         */
        closeDbTimer$.pipe(
            switchMap(period => {
                if (period === null) return ofNull();
                return timer(period);
            }),
            filter(x => x !== null),
            switchMap(() => {
                if (!currentDbInstance$.value || !currentDbInstance$.value.dbConnection) return ofNull();

                /**
                 * Mark DB as closing
                 */
                currentDbInstance$.next({
                    dbConnection: currentDbInstance$.value.dbConnection,
                    isDbConnectionClosing: true
                });
                return currentDbInstance$.value.dbConnection.close().then(() => {
                    /**
                     * Mark DB as closed and removed
                     */
                    currentDbInstance$.next({
                        dbConnection: null,
                        isDbConnectionClosing: false
                    })
                });
            })
        ).subscribe();
    }

    const requestScheduler$ = new Subject<ScheduledRequest>();

    requestScheduler$.pipe(concatMap(x => {

        return startRequest$({dbRef, closeDbTimer$, currentDbInstance$})
            .then(dbConnection => processRequest$({
                dbConnection,
                request$: x.request$(dbConnection),
                publishResult: x.publishResult,
                publishError: x.publishError
            }))
            .then(() => finalizeRequest$({closeDbTimer$}, config))
            /**
             * We catch all errors in the chain to ensure that scheduler
             * cannot stop.
             */
            .catch(e => {
                console.error("DB error: ", e);
            });

    })).subscribe();

    const db = {
        get$: <TMappingResult>(
            selection: CompositeEntityQuery<TEntityTypeMap>,
            map?: (queryResult: CompositeEntityQueryResult<TEntityTypeMap>) => TMappingResult
        ): Promise<CompositeEntityQueryResult<TEntityTypeMap> | TMappingResult> => {
            return new Promise((resolve, reject) => requestScheduler$.next({
                request$: dbConnection => get$(dbConnection, selection, map),
                publishResult: resolve,
                publishError: reject
            }));
        },

        initialize$: () => {
            return new Promise((resolve, reject) => requestScheduler$.next({
                request$: dbConnection => initialize$(dbConnection, entityTypes as Array<string>),
                publishResult: resolve,
                publishError: reject
            }))
        },

        dispatch$: (action: CompositeEntityActionPayload<TEntityTypeMap, null>) => {
            return new Promise((resolve, reject) => requestScheduler$.next({
                request$: dbConnection => dispatch$(dbConnection, action),
                publishResult: resolve,
                publishError: reject
            }))
        },
    } as unknown as EntityDb<TEntityTypeMap>;

    db.initialize$ = async () => {
        await new Promise((resolve, reject) => requestScheduler$.next({
            request$: dbConnection => initialize$(dbConnection, entityTypes as Array<string>),
            publishResult: resolve,
            publishError: reject
        }));
        if (migrations.length > 0) {
            await runMigrations$({db, migrations});
        }
    }

    return db;
}
