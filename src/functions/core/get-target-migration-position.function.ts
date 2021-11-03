import {Many} from "data-modeling";
import {MigrationInfo} from "../../models";
import {migrationConfig} from "../../constants";
import {getMaxMigrationPosition} from "./get-max-migration-position.function";

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
