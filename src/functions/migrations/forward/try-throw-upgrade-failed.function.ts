import {Migration} from "../../../models";
import {Many} from "data-modeling";
import {createUpgradeFailedError} from "../../errors/create-upgrade-failed-error.function";
import {toPosition} from "../../util/to-position.function";

export function tryThrowUpgradeFailed(payload: {
    readonly forwardMigrations: ReadonlyArray<Migration<any, any>>;
    readonly positionsToMigrateForward: Many<number>;
    readonly targetPosition: number;
    readonly currentPosition: number;
}): void {

    const forwardMigrations = payload.forwardMigrations;
    const positionsToMigrateForward = payload.positionsToMigrateForward;
    const currentPosition = payload.currentPosition;
    const targetPosition = payload.targetPosition;

    if (positionsToMigrateForward.length === 0) return;

    const availableForwardMigrationPositions = forwardMigrations.map(toPosition);

    if (availableForwardMigrationPositions.length > 0
        && positionsToMigrateForward.every(x => !availableForwardMigrationPositions.includes(x))) return;

    throw createUpgradeFailedError({targetVersion: targetPosition, currentVersion: currentPosition});

}