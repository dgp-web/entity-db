export class UpgradeFailedError extends Error {

    readonly type = "[EntityDb] UpgradeFailed";

    constructor(payload: {
        readonly currentVersion: number;
        readonly targetVersion: number;
    }) {
        super(`An upgrade is required because the target database version ${payload.targetVersion} exceeds the current version ${payload.currentVersion}.
However, the needed migrations are not available. 
Please ensure a) that the correct target version has been selected and b) that migrations for all versions have been provided.`);
    }

}