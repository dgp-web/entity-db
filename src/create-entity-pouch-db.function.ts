import { CompositeEntityActionPayload } from "entity-store/src/models";
import { concatMap } from "rxjs/operators";
import {
    createCloseDbTimer,
    createDbConnectionSource,
    createRequestScheduler,
    dispatch$,
    finalizeRequest$,
    get$,
    initialize$,
    processRequest$,
    registerCloseTimer,
    runMigrations$,
    startRequest$,
    tryPush
} from "./functions";
import {
    CompositeEntityQuery,
    CompositeEntityQueryResult,
    EntityDb,
    EntityPouchDbPayload,
    MigrationEntities
} from "./models";
import { Many, Mutable } from "data-modeling";
import { entityPouchDbConfig } from "./constants";

export function createEntityPouchDb<TEntityTypeMap extends MigrationEntities>(
    payload: EntityPouchDbPayload<TEntityTypeMap>,
    config = entityPouchDbConfig
): EntityDb<TEntityTypeMap> {

    const dbRef = payload.dbRef;
    const entityTypes = payload.entityTypes as Mutable<Many<string>>;
    tryPush(entityTypes, "migrationInfo");
    const migrations = payload.migrations ? payload.migrations : [];

    /**
     * Setup utilities
     */
    const dbConnectionSource$ = createDbConnectionSource();
    const closeDbTimer$ = createCloseDbTimer();
    const requestScheduler$ = createRequestScheduler();

    if (typeof dbRef === "function") registerCloseTimer({closeDbTimer$, dbConnectionSource$});

    requestScheduler$.pipe(concatMap(x => {

        return startRequest$({dbRef, closeDbTimer$, currentDbInstance$: dbConnectionSource$})
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
