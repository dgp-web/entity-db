import { EntityTypeMap, Many } from "data-modeling";
import { EntityMaskingRules } from "./entity-masking-rules.model";

export interface ChangesPublishConfig<TEntityTypeMap extends EntityTypeMap> {
    readonly whitelistedEntities?: Many<keyof TEntityTypeMap>;
    readonly maskingRules: EntityMaskingRules<TEntityTypeMap>;
}