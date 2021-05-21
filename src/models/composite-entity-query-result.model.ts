import { EntityTypeMap, KVS } from "data-modeling";

export type CompositeEntityQueryResult<TEntityTypeMap extends EntityTypeMap> = {
    readonly [K in keyof TEntityTypeMap]?: KVS<TEntityTypeMap[K]>;
}
