import {EntityDb, MigrationEntities, WithMigrations} from "../../models";
import {migrationConfig} from "../../constants";
import {addMigrationInfo} from "../actions/add-migration-info.action";
import {getTargetMigrationPosition} from "../migrations/get-target-migration-position.function";
import {getForwardMigrations} from "../migrations/forward/get-forward-migrations.function";
import {getBackwardMigrations} from "../migrations/backward/get-backward-migrations.function";
import {getCurrentMaxMigrationPosition} from "../migrations/get-current-max-migration-position.function";
import {tryThrowDowngradeFailed} from "../migrations/backward/try-throw-downgrade-failed.function";
import {tryThrowUpgradeFailed} from "../migrations/forward/try-throw-upgrade-failed.function";

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

    tryThrowUpgradeFailed({currentPosition, targetPosition, forwardMigrations});

    const backwardMigrations = getBackwardMigrations({migrations, targetPosition, currentPosition});

    tryThrowDowngradeFailed({currentPosition, targetPosition, backwardMigrations});

    for (const migration of forwardMigrations) {
        await migration.execute$({from: db, to: db});
        await db.dispatch$(addMigrationInfo(migration));
    }

    for (const migration of backwardMigrations) {
        await migration.revert$({from: db, to: db});
        await db.dispatch$(addMigrationInfo(migration, true));
    }
}


