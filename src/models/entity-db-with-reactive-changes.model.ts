import { EntityTypeMap } from "data-modeling";
import { CRUDEntityDb } from "./crud-entity-db.model";
import { Observable } from "rxjs";
import { CompositeEntityActionPayload } from "entity-store/src/models";

export interface EntityDbWithReactiveChanges<TEntityTypeMap extends EntityTypeMap> extends CRUDEntityDb<TEntityTypeMap> {
    readonly changes$: Observable<CompositeEntityActionPayload<TEntityTypeMap, null>>;
}