import { EntityTypeMap } from "entity-store";
import { CompositeEntityActionPayload } from "entity-store/src/models";
import { concatMap } from "rxjs/operators";
import { Subject } from "rxjs";
import { dispatch$, get$, initialize$, processRequest$ } from "./functions";
import { CompositeEntityQuery, CompositeEntityQueryResult, EntityDb, PouchDbFactory, ScheduledRequest } from "./models";

export function createEntityPouchDb<TEntityTypeMap extends EntityTypeMap>(
    entityTypes: ReadonlyArray<keyof TEntityTypeMap>,
    dbRef: PouchDB.Database | PouchDbFactory
): EntityDb<TEntityTypeMap> {

    function getDbConnection() {
        if (typeof dbRef === "object") return dbRef as PouchDB.Database;
        else if (typeof dbRef === "function") return dbRef();
    }

    const requestScheduler$ = new Subject<ScheduledRequest>();

    requestScheduler$.pipe(concatMap(x => {
        /**
         * Create a DB connection
         */
        const dbConnection = getDbConnection();
        return processRequest$({
            dbConnection,
            request$: x.request$(dbConnection),
            publishResult: x.publishResult
        });
    })).subscribe();

    return {
        get$: <TMappingResult>(
            selection: CompositeEntityQuery<TEntityTypeMap>,
            map?: (queryResult: CompositeEntityQueryResult<TEntityTypeMap>) => TMappingResult
        ): Promise<CompositeEntityQueryResult<TEntityTypeMap> | TMappingResult> => {
            return new Promise(resolve => requestScheduler$.next({
                request$: dbConnection => get$(dbConnection, selection, map),
                publishResult: resolve
            }));
        },

        initialize$: () => {
            return new Promise(resolve => requestScheduler$.next({
                request$: dbConnection => initialize$(dbConnection, entityTypes as Array<string>),
                publishResult: resolve
            }))
        },

        dispatch$: (action: CompositeEntityActionPayload<TEntityTypeMap, null>) => {
            return new Promise(resolve => requestScheduler$.next({
                request$: dbConnection => dispatch$(dbConnection, action),
                publishResult: resolve
            }))
        }
    };
}
