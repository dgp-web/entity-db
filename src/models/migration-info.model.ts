export interface MigrationInfo {
    readonly migrationId: number;
    readonly label: string;
    readonly description?: string;
    readonly position: number;
    readonly executionDate?: number;
}
