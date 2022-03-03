import {DowngradeFailureError} from "../../models";

export function createDowngradeFailedError(payload: {
    readonly currentVersion: number;
    readonly targetVersion: number;
}): DowngradeFailureError {
    return new DowngradeFailureError(payload);
}

