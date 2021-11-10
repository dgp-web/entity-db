import {DateFactory, Migration, MigrationInfo} from "../../models";
import {defaultDateFactory} from "../../constants";

export function createMigrationInfo(migration: Migration<any, any>, config: {
    readonly isReversal?: boolean;
} & DateFactory = {
    ...defaultDateFactory
}): MigrationInfo {
    const executionDate = config.createDate().valueOf();

    return {
        migrationId: migration.migrationId,
        label: migration.label,
        position: migration.position,
        description: migration.description,
        executionDate,
        isReversal: config.isReversal
    };
}