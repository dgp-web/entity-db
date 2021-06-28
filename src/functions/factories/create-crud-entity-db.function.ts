import { CRUDEntityDb, MigrationEntities, WithRequestScheduler } from "../../models";
import { createDispatch$Handler, createGet$Handler } from "../handlers";

export function createCRUDEntityDb<TEntityTypeMap extends MigrationEntities>(
    payload: WithRequestScheduler
): CRUDEntityDb<TEntityTypeMap> {
    const requestScheduler$ = payload.requestScheduler$;

    return {
        get$: createGet$Handler<TEntityTypeMap>({requestScheduler$}),
        dispatch$: createDispatch$Handler<TEntityTypeMap>({requestScheduler$}),
    };
}
