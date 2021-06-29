import { MigrationEntities, WithRequestScheduler } from "../../models";
import { CompositeEntityActionPayload } from "entity-store/src/models";
import { dispatch$ } from "../core/dispatch$";

export function createDispatch$Handler<TEntityTypeMap extends MigrationEntities>(
    payload: WithRequestScheduler
) {
    const requestScheduler$ = payload.requestScheduler$;

    return (action: CompositeEntityActionPayload<TEntityTypeMap, null>) => {
        return new Promise<void>((resolve, reject) => requestScheduler$.next({
            request$: dbConnection => dispatch$(dbConnection, action),
            publishResult: resolve,
            publishError: reject
        }))
    };
}
