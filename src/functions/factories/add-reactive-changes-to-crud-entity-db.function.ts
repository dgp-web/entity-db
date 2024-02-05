import { CRUDEntityDb, EntityDbWithReactiveChanges, MigrationEntities } from "../../models";
import { Subject } from "rxjs";
import { CompositeEntityActionPayload } from "entity-store/src/models";

export function addReactiveChangesToCRUDEntityDb<TEntityTypeMap extends MigrationEntities>(
    payload: CRUDEntityDb<TEntityTypeMap>
): EntityDbWithReactiveChanges<TEntityTypeMap> {
    const changes$ = new Subject<CompositeEntityActionPayload<TEntityTypeMap, null>>();

    const dispatch$ = async (action: CompositeEntityActionPayload<TEntityTypeMap, null>): Promise<void> => {
        await payload.dispatch$(action);
        changes$.next(action);
    };

    return {
        ...payload,
        dispatch$,
        changes$: changes$.asObservable()
    };

}