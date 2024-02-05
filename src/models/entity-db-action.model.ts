import { EntityTypeMap } from "data-modeling";
import { CompositeEntityActionPayload } from "entity-store/src/models";

export type EntityDbAction<TEntityTypeMap extends EntityTypeMap> = CompositeEntityActionPayload<TEntityTypeMap, null>;