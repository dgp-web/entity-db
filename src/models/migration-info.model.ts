import {MigrationId} from "./migration-id.model";

export interface MigrationInfo {
    readonly migrationId: MigrationId;
    readonly label: string;
    readonly description?: string;
    readonly position: number;
    readonly executionDate?: number;
    readonly isReversal?: boolean;
}
