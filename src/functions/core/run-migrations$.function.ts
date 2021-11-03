import {EntityDb, MigrationEntities, WithMigrations} from "../../models";
import {migrationConfig} from "../../constants";
import {addMigrationInfo} from "../actions/add-migration-info.action";
import {getTargetMigrationPosition} from "./get-target-migration-position.function";
import {getForwardMigrations} from "./get-forward-migrations.function";
import {getBackwardMigrations} from "./get-backward-migrations.function";
import {getCurrentMaxMigrationPosition} from "./get-current-max-migration-position.function";

// TODO: Extract this default payload that receives an entity-db and a migrations object wherever it occurs
export interface RunMigrations$Payload<TEntities extends MigrationEntities> extends WithMigrations {
    readonly db: EntityDb<TEntities>;
}

/**
 * Describes how the database should be setup and migrated to a new level
 */
export async function runMigrations$<TEntities extends MigrationEntities>(
    payload: RunMigrations$Payload<TEntities>,
    config = migrationConfig
): Promise<void> {

    if (config.disableAutoMigrations) return;

    const db = payload.db;
    const migrations = payload.migrations;

    const result = await db.get$({migrationInfo: "all"});

    const migrationInfos = Object.values(result.migrationInfo);
    const targetPosition = getTargetMigrationPosition({migrations}, config);
    const currentPosition = getCurrentMaxMigrationPosition({migrationInfos});

    const forwardMigrations = getForwardMigrations({migrations, targetPosition, currentPosition});
    const backwardMigrations = getBackwardMigrations({migrations, targetPosition, currentPosition});

    for (const migration of forwardMigrations) {
        await migration.execute$({from: db, to: db});
        await db.dispatch$(addMigrationInfo(migration));
    }

    for (const migration of backwardMigrations) {
        await migration.execute$({from: db, to: db});
        await db.dispatch$(addMigrationInfo(migration));
    }
}

