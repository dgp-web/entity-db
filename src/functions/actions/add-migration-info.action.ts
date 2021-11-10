import {Migration, MigrationEntities} from "../../models";
import {createMigrationInfo} from "../factories/create-migration-info.function";
import {AddEntityActionParamsMap} from "entity-store/src/models/composite-entity-action-payload.model";
import {defaultDateFactory} from "../../constants";

export function addMigrationInfo<TEntities extends MigrationEntities>(migration: Migration<any, any>, isReversal?: boolean) {
    return {
        add: {
            migrationInfo: {
                [migration.migrationId]: createMigrationInfo(migration, {
                    isReversal,
                    ...defaultDateFactory
                })
            }
        } as AddEntityActionParamsMap<TEntities, null>
    }
}