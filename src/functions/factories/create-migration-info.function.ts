import {Migration, MigrationInfo} from "../../models";
import {defaultDateFactory} from "../../constants";

export function createMigrationInfo(migration: Migration<any, any>, config = defaultDateFactory): MigrationInfo {
    return {
        migrationId: migration.migrationId,
        label: migration.label,
        position: migration.position,
        description: migration.description,
        executionDate: config.createDate().valueOf()
    };
}