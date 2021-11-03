import {Migration} from "../../../models";
import {createUpgradeFailedError} from "../../errors/create-upgrade-failed-error.function";
import {toPosition} from "../../util/to-position.function";
import {getRequiredForwardMigrationPositions} from "./get-required-forward-migration-positions.function";

export function tryThrowUpgradeFailed(payload: {
    readonly forwardMigrations: ReadonlyArray<Migration<any, any>>;
    readonly targetPosition: number;
    readonly currentPosition: number;
}): void {

    const forwardMigrations = payload.forwardMigrations;
    const currentPosition = payload.currentPosition;
    const targetPosition = payload.targetPosition;

    const positionsToMigrateForward = getRequiredForwardMigrationPositions({currentPosition, targetPosition});

    if (positionsToMigrateForward.length === 0) return;

    const availableForwardMigrationPositions = forwardMigrations.map(toPosition);

    if (availableForwardMigrationPositions.length > 0
        && positionsToMigrateForward.every(x => availableForwardMigrationPositions.includes(x))) return;

    throw createUpgradeFailedError({targetVersion: targetPosition, currentVersion: currentPosition});

}