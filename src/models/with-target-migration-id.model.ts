import {MigrationId} from "./migration-id.model";

export interface WithTargetMigrationId {
    readonly targetMigrationId?: MigrationId;
}
