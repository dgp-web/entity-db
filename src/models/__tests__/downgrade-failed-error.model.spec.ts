import {createDowngradeFailedErrorMessage, DowngradeFailedError} from "../downgrade-failed-error.model";

describe(DowngradeFailedError.name, () => {

    const targetVersion = 1;
    const currentVersion = 2;

    const error = new DowngradeFailedError({
        targetVersion, currentVersion
    });

    it(`should have type "[EntityDb] DowngradeFailed"`, () => {
        expect(error.type).toBe("[EntityDb] DowngradeFailed");
    });

    it(`should have message`, () => {
        expect(error.message).toBe(createDowngradeFailedErrorMessage({targetVersion, currentVersion}));
    });

});
