import {
    CompositeEntityQuery,
    CompositeEntityQueryResult,
    MigrationEntities,
    WithRequestScheduler
} from "../../models";
import { get$ } from "../core";

export function createGet$Handler<TEntityTypeMap extends MigrationEntities>(
    payload: WithRequestScheduler
) {
    const requestScheduler$ = payload.requestScheduler$;

    return <TMappingResult>(
        selection: CompositeEntityQuery<TEntityTypeMap>,
        map?: (queryResult: CompositeEntityQueryResult<TEntityTypeMap>) => TMappingResult
    ): Promise<CompositeEntityQueryResult<TEntityTypeMap> | TMappingResult> => {
        return new Promise((resolve, reject) => requestScheduler$.next({
            request$: dbConnection => get$(dbConnection, selection, map),
            publishResult: resolve,
            publishError: reject
        }));
    }
}
