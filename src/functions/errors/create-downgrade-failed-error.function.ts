import {DowngradeFailedError} from "../../models";

export function createDowngradeFailedError(payload: {
    readonly currentVersion: number;
    readonly targetVersion: number;
}): DowngradeFailedError {
    return new DowngradeFailedError(payload);
}

