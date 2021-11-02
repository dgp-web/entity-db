import { EntityPouchDbConfig } from "../models";
import { migrationConfig } from "./migration-config.constant";

export const entityPouchDbConfig: EntityPouchDbConfig = {
    keepIdleConnectionAlivePeriod: 5000,
    ...migrationConfig
};
