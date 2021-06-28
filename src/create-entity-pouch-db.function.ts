import { CompositeEntityActionPayload } from "entity-store/src/models";
import { concatMap, filter, first, map, switchMap } from "rxjs/operators";
import { BehaviorSubject, of, Subject, timer } from "rxjs";
import { dispatch$, get$, initialize$, processRequest$, resolvePouchDbDatabase, runMigrations$ } from "./functions";
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
import { isDbConnectionOpen } from "./functions/is-db-connection-open.function";
import { entityPouchDbConfig } from "./constants/entity-pouch-db-config.constant";

export function createEntityPouchDb<TEntityTypeMap extends MigrationEntities>(
    payload: EntityPouchDbPayload<TEntityTypeMap>,
    config = entityPouchDbConfig
): EntityDb<TEntityTypeMap> {

    const dbRef = payload.dbRef;
    const entityTypes = payload.entityTypes as Mutable<Many<string>>;
    if (!entityTypes.includes("migrationInfo")) {
        entityTypes.push("migrationInfo");
    }
    const migrations = payload.migrations ? payload.migrations : [];


    const currentDbInstance$ = new BehaviorSubject<DbConnectionInfo>(null);

    const closeDbTimer$ = new Subject<number>();

    if (typeof dbRef === "function") {
        closeDbTimer$.pipe(
            switchMap(period => {
                if (period === null) return of(null);

                return timer(period);
            }),
            filter(x => x !== null),
            switchMap(() => {
                if (!currentDbInstance$.value || !currentDbInstance$.value.dbConnection) return of(null);

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

    function startRequest$(): Promise<PouchDB.Database> {

        if (typeof dbRef === "object") return Promise.resolve(dbRef);

        const currentValue = currentDbInstance$.value;

        /**
         * Create a new db if none is existing but do nothing if we
         * are still closing
         */
        if (!currentValue || !currentValue.dbConnection) {
            currentDbInstance$.next({
                dbConnection: resolvePouchDbDatabase(dbRef),
                isDbConnectionClosing: false
            });
        }
        /**
         * Reset the closing timer
         */
        closeDbTimer$.next(null);

        return currentDbInstance$.pipe(
            /**
             * Only pass through new values if we have a db
             * that is not closing
             */
            filter(isDbConnectionOpen),
            map(x => x.dbConnection),
            first()
        ).toPromise();

    }

    function finalizeRequest$(): Promise<void> {
        closeDbTimer$.next(config.keepIdleConnectionAlivePeriod);
        return Promise.resolve();
    }

    const requestScheduler$ = new Subject<ScheduledRequest>();

    requestScheduler$.pipe(concatMap(x => {

        return startRequest$().then(dbConnection => processRequest$({
            dbConnection,
            request$: x.request$(dbConnection),
            publishResult: x.publishResult,
            publishError: x.publishError
        })).then(() => finalizeRequest$())
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
