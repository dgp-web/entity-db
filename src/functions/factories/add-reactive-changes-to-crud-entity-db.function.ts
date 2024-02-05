import {
    ChangesPublishConfig,
    CRUDEntityDb,
    EntityDbAction,
    EntityDbWithReactiveChanges,
    MigrationEntities
} from "../../models";
import { Observable, Subject } from "rxjs";
import { CompositeEntityActionPayload } from "entity-store/src/models";
import { concatMap } from "rxjs/operators";
import { filterActionByChangesPublishConfig$ } from "../masking/filter-action-by-changes-publish-config$.function";


export function addReactiveChangesToCRUDEntityDb<TEntityTypeMap extends MigrationEntities>(
    dbRef: CRUDEntityDb<TEntityTypeMap>
): EntityDbWithReactiveChanges<TEntityTypeMap> {

    const changes$ = new Subject<EntityDbAction<TEntityTypeMap>>();

    const dispatch$ = async (action: CompositeEntityActionPayload<TEntityTypeMap, null>): Promise<void> => {
        await dbRef.dispatch$(action);
        changes$.next(action);
    };

    const getChanges$ = (config: ChangesPublishConfig<TEntityTypeMap>): Observable<EntityDbAction<TEntityTypeMap>> => {
        if (!config) return changes$.asObservable();

        return changes$.pipe(
            concatMap(unmaskedAction => {
                return filterActionByChangesPublishConfig$({
                    action: unmaskedAction,
                    config,
                    dbRef
                });
            })
        );
    };

    return {
        ...dbRef,
        dispatch$,
        getChanges$
    };

}