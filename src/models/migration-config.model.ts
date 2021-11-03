import { WithTargetMigrationId } from "./with-target-migration-id.model";
import { WithDisableAutoMigrations } from "./with-disable-auto-migration.model";

export interface MigrationConfig extends WithTargetMigrationId, WithDisableAutoMigrations {

}
