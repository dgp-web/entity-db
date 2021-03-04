import { EntityTypeMap } from "entity-store";
import { EntityQuery } from "./entity-query.model";

export type CompositeEntityQuery<TEntityTypeMap extends EntityTypeMap> = {
    readonly [K in keyof TEntityTypeMap]?: EntityQuery<TEntityTypeMap[K]>;
}
