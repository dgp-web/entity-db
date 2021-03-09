import { EntityTypeMap, KVS } from "entity-store";

export type CompositeEntityQueryResult<TEntityTypeMap extends EntityTypeMap> = {
    readonly [K in keyof TEntityTypeMap]?: KVS<TEntityTypeMap[K]>;
}
