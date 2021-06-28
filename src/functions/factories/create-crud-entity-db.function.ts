import { CRUDEntityDb, MigrationEntities, WithRequestScheduler } from "../../models";
import { createGet$Handler } from "../handlers/create-get$-handler.function";
import { createDispatch$Handler } from "../handlers/create-dispatch$-handler.function";

export function createCRUDEntityDb<TEntityTypeMap extends MigrationEntities>(
    payload: WithRequestScheduler
): CRUDEntityDb<TEntityTypeMap> {
    const requestScheduler$ = payload.requestScheduler$;

    return {
        get$: createGet$Handler<TEntityTypeMap>({requestScheduler$}),
        dispatch$: createDispatch$Handler<TEntityTypeMap>({requestScheduler$}),
    };
}
