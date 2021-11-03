import {Migration, MigrationEntities} from "../../models";
import {createMigrationInfo} from "../factories/create-migration-info.function";
import {AddEntityActionParamsMap} from "entity-store/src/models/composite-entity-action-payload.model";

export function addMigrationInfo<TEntities extends MigrationEntities>(migration: Migration<any, any>) {
    return {
        add: {
            migrationInfo: {
                [migration.migrationId]: createMigrationInfo(migration)
            }
        } as AddEntityActionParamsMap<TEntities, null>
    }
}