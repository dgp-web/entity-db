import { EntityTypeMap } from "data-modeling";
import { CRUDEntityDb } from "./crud-entity-db.model";

export interface EntityDb<TEntityTypeMap extends EntityTypeMap> extends CRUDEntityDb<TEntityTypeMap> {
    initialize$(): Promise<void>;
}
