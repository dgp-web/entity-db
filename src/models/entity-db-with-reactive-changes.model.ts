import { EntityTypeMap } from "data-modeling";
import { CRUDEntityDb } from "./crud-entity-db.model";
import { Observable } from "rxjs";
import { EntityDbAction } from "./entity-db-action.model";
import { ChangesPublishConfig } from "./changes-publish-config.model";

export interface EntityDbWithReactiveChanges<TEntityTypeMap extends EntityTypeMap> extends CRUDEntityDb<TEntityTypeMap> {
    getChanges$(payload: ChangesPublishConfig<TEntityTypeMap>): Observable<EntityDbAction<TEntityTypeMap>>;
}