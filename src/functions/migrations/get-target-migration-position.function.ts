import {WithMigrations} from "../../models";
import {migrationConfig} from "../../constants";
import {getMaxMigrationPosition} from "./get-max-migration-position.function";

export function getTargetMigrationPosition(
    payload: WithMigrations,
    config = migrationConfig
): number {

    const migrations = payload.migrations;

    let targetPosition: number;

    if (config.targetMigrationId !== null && config.targetMigrationId !== undefined) {
        targetPosition = migrations.find(x => x.migrationId === config.targetMigrationId)?.position;
    } else {
        targetPosition = getMaxMigrationPosition({migrations});
    }

    return targetPosition;
}
