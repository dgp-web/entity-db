import { EntityTypeMap } from "data-modeling";
import { EntityDbWithReactiveChanges } from "./entity-db-with-reactive-changes.model";

export interface EntityDb<TEntityTypeMap extends EntityTypeMap> extends EntityDbWithReactiveChanges<TEntityTypeMap> {
    initialize$(): Promise<void>;
}
