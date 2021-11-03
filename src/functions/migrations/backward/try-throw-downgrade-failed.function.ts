import {Migration} from "../../../models";
import {createDowngradeFailedError} from "../../errors/create-downgrade-failed-error.function";
import {toPosition} from "../../util/to-position.function";
import {getRequiredBackwardMigrationPositions} from "./get-required-backward-migration-positions.function";

export function tryThrowDowngradeFailed(payload: {
    readonly backwardMigrations: ReadonlyArray<Migration<any, any>>;
    readonly targetPosition: number;
    readonly currentPosition: number;
}): void {

    const backwardMigrations = payload.backwardMigrations;
    const currentPosition = payload.currentPosition;
    const targetPosition = payload.targetPosition;

    const positionsToMigrateBackward = getRequiredBackwardMigrationPositions({currentPosition, targetPosition});

    if (positionsToMigrateBackward.length === 0) return;

    const availableBackwardMigrationPositions = backwardMigrations.map(toPosition);

    if (availableBackwardMigrationPositions.length > 0
        && positionsToMigrateBackward.every(x => !availableBackwardMigrationPositions.includes(x))) return;

    throw createDowngradeFailedError({targetVersion: targetPosition, currentVersion: currentPosition});

}