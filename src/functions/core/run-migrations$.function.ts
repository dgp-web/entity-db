import {EntityDb, Migration, MigrationEntities, MigrationInfo} from "../../models";
import * as _ from "lodash";
import {migrationConfig} from "../../constants";
import {addMigrationInfo} from "../actions/add-migration-info.action";
import {Many} from "data-modeling";
import {getMaxMigrationPosition} from "./get-max-migration-position.function";

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

    if (config.disableAutoMigrations) return;

    const db = payload.db;
    const migrations = payload.migrations;

    const result = await db.get$({migrationInfo: "all"});

    const migrationInfos = Object.values(result.migrationInfo);
    const targetPosition = getTargetMigrationPosition({migrationInfos}, config);

    const forwardMigrations = getForwardMigrations({migrations, targetPosition});
    const backwardMigrations = getBackwardMigrations({targetPosition, migrations});

    for (const migration of forwardMigrations) {
        await migration.execute$({from: db, to: db});
        await db.dispatch$(addMigrationInfo(migration));
    }

    for (const migration of backwardMigrations) {
        await migration.execute$({from: db, to: db});
        await db.dispatch$(addMigrationInfo(migration));
    }
}

export function getForwardMigrations(payload: {
    readonly migrations: ReadonlyArray<Migration<any, any>>;
    readonly targetPosition: number;
}): ReadonlyArray<Migration<any, any>> {

    const migrations = payload.migrations;
    const targetPosition = payload.targetPosition;

    let forwardMigrations = migrations.filter(migration => migration.position > targetPosition);
    forwardMigrations = _.sortBy(forwardMigrations, x => x.position);
    return forwardMigrations;

}

export function getBackwardMigrations(payload: {
    readonly migrations: ReadonlyArray<Migration<any, any>>;
    readonly targetPosition: number;
}): ReadonlyArray<Migration<any, any>> {

    const migrations = payload.migrations;
    const targetPosition = payload.targetPosition;

    let backwardMigrations = migrations.filter(migration => migration.position > targetPosition);
    backwardMigrations = _.sortBy(backwardMigrations, x => x.position).reverse();
    return backwardMigrations;

}

export function getTargetMigrationPosition(payload: {
    readonly migrationInfos: Many<MigrationInfo>;
}, config = migrationConfig): number {

    const migrationInfos = payload.migrationInfos;

    let targetPosition: number;

    if (config.targetMigrationId !== null && config.targetMigrationId !== undefined) {
        targetPosition = migrationInfos.find(x => x.migrationId === config.targetMigrationId)?.position;
    } else {
        targetPosition = getMaxMigrationPosition({migrationInfos});
    }

    return targetPosition;
}
