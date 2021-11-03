export function createUpgradeFailedError(payload: {
    readonly currentVersion: number;
    readonly targetVersion: number;
}): Error {

    const currentVersion = payload.currentVersion;
    const targetVersion = payload.targetVersion;

    const message = `An upgrade is required because the target database version ${targetVersion} is below the current version ${currentVersion}.
However, the needed migrations are not available. 
Please ensure a) that the correct target version has been selected and b) that migrations for all versions have been provided.`

    return new Error(message);

}

