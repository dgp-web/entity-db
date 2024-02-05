import { EntityTypeMap } from "data-modeling";
import { ChangesPublishConfig } from "../../models";

export function byDbChangesPublishConfig<TEntityTypeMap extends EntityTypeMap>(
    config: ChangesPublishConfig<TEntityTypeMap>
) {
    return (x: keyof TEntityTypeMap) => !config.whitelistedEntities || config.whitelistedEntities.includes(x);
}