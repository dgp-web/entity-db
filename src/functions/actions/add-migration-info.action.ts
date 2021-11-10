import {Migration, MigrationEntities} from "../../models";
import {createMigrationInfo} from "../factories/create-migration-info.function";
import {AddEntityActionParamsMap} from "entity-store/src/models/composite-entity-action-payload.model";
import {defaultDateFactory} from "../../constants";

export function addMigrationInfo<TEntities extends MigrationEntities>(migration: Migration<any, any>, isReversal?: boolean) {

    const migrationInfo = createMigrationInfo(migration, {
        isReversal, ...defaultDateFactory
    });

    const key = migrationInfo.migrationId + "." + migrationInfo.executionDate;

    return {
        add: {
            migrationInfo: {
                [key]: migrationInfo
            }
        } as AddEntityActionParamsMap<TEntities, null>
    }
}