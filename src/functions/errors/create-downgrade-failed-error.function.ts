export function createDowngradeFailedError(payload: {
    readonly currentVersion: number;
    readonly targetVersion: number;
}): Error {

    const currentVersion = payload.currentVersion;
    const targetVersion = payload.targetVersion;

    const message = `A downgrade is required because the current database version ${currentVersion} exceeds the target version ${targetVersion}.
However, the needed migrations are not available or lack revert$-operations.
Please ensure a) that the correct target version has been selected
and b) that migrations for all versions have been provided
and c) that revert$-operations have been implemented for these migrations.`

    return Error(message);

}