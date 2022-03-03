import {UpgradeFailedError} from "../../models";

export function createUpgradeFailedError(payload: {
    readonly currentVersion: number;
    readonly targetVersion: number;
}): UpgradeFailedError {
    return new UpgradeFailedError(payload);
}

