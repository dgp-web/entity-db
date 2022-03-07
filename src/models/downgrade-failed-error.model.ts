export function createDowngradeFailedErrorMessage(payload: {
    readonly currentVersion: number;
    readonly targetVersion: number;
}): string {
    return `A downgrade is required because the current database version ${payload.currentVersion} exceeds the target version ${payload.targetVersion}.
However, the needed migrations are not available or lack revert$-operations.
Please ensure a) that the correct target version has been selected
and b) that migrations for all versions have been provided
and c) that revert$-operations have been implemented for these migrations.`;
}

export class DowngradeFailedError extends Error {

    readonly type = "[EntityDb] DowngradeFailed";

    constructor(payload: {
        readonly currentVersion: number;
        readonly targetVersion: number;
    }) {
        super(createDowngradeFailedErrorMessage(payload));
    }

}