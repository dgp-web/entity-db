import {createUpgradeFailedErrorMessage, UpgradeFailedError} from "../upgrade-failed-errror.model";

describe(UpgradeFailedError.name, () => {

    const targetVersion = 1;
    const currentVersion = 2;

    const error = new UpgradeFailedError({
        targetVersion, currentVersion
    });

    it(`should have type "[EntityDb] UpgradeFailed"`, () => {
        expect(error.type).toBe("[EntityDb] UpgradeFailed");
    });

    it(`should have message`, () => {
        expect(error.message).toBe(createUpgradeFailedErrorMessage({targetVersion, currentVersion}));
    });

});
