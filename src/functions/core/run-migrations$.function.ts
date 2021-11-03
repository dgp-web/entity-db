import {EntityDb, Migration, MigrationEntities, MigrationInfo} from "../../models";
import * as _ from "lodash";
import {AddEntityActionParamsMap} from "entity-store/src/models/composite-entity-action-payload.model";
import {migrationConfig} from "../../constants";
import {createMigrationInfo} from "../factories/create-migration-info.function";

// TODO: Extract this default payload that receives an entity-db and a migrations object wherever it occurs
export interface RunMigrations$Payload<TEntities extends MigrationEntities> {
    readonly db: EntityDb<TEntities>;
    readonly migrations: ReadonlyArray<Migration<any, any>>;
}

/**
 * Describes how the database should be setup and migrated to a new level
 */
export async function runMigrations$<TEntities extends MigrationEntities>(
    payload: RunMigrations$Payload<TEntities>,
    config = migrationConfig
): Promise<void> {

    const db = payload.db;
    const migrations = payload.migrations;

    const result = await db.get$({migrationInfo: "all"});

    let migrationInfos = Object.values(result.migrationInfo);
    migrationInfos = _.sortBy(migrationInfos, x => x.position);
    // TODO: Adjust so we get the target position
    // TODO: Extract getMaxPosition as default if no targetMigrationId is passed
    // TODO: Extract getTargetMigrationPosition
    // TODO: Add and test error handling as specified
    const maxPosition = migrationInfos.length > 0 ? _.max(migrationInfos.map(x => x.position)) : 0;

    const newMigrations = migrations.filter(migration => migration.position > maxPosition);

    for (const migration of newMigrations) {
        await migration.execute$({from: db, to: db});
        await db.dispatch$(addMigrationInfo(migration));
    }
}


export function addMigrationInfo<TEntities extends MigrationEntities>(migration: Migration<any, any>) {
    return {
        add: {
            migrationInfo: {
                [migration.migrationId]: createMigrationInfo(migration)
            }
        } as AddEntityActionParamsMap<TEntities, null>
    }
}