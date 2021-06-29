import { EntityTypeMap } from "data-modeling";
import { EntityQuery } from "./entity-query.model";

export type CompositeEntityQuery<TEntityTypeMap extends EntityTypeMap> = {
    readonly [K in keyof TEntityTypeMap]?: EntityQuery<TEntityTypeMap[K]>;
}
