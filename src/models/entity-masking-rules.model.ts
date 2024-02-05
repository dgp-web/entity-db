import { EntityTypeMap } from "data-modeling";

export type EntityMaskingRules<TEntityTypeMap extends EntityTypeMap> = {
    readonly [K in keyof TEntityTypeMap]?: (entity: TEntityTypeMap[K]) => TEntityTypeMap[K];
};