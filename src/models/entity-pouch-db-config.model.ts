import { MigrationConfig } from "./migration-config.model";

export interface EntityPouchDbConfig extends MigrationConfig {
    readonly keepIdleConnectionAlivePeriod: number;
}
