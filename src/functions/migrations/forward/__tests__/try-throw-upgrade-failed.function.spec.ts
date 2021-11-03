import {tryThrowUpgradeFailed} from "../try-throw-upgrade-failed.function";
import {testMigration02} from "../../../../__tests__/constants/test-migration-02.constant";
import {createUpgradeFailedError} from "../../../errors/create-upgrade-failed-error.function";

describe("tryThrowUpgradeFailed", () => {

    it("should throw an error if not all required forwardMigrations are available", () => {

        const expectedError = createUpgradeFailedError({
            currentVersion: 1,
            targetVersion: 3
        });

        expect(
            () => tryThrowUpgradeFailed({
                forwardMigrations: [testMigration02],
                currentPosition: 1,
                targetPosition: 3
            })
        ).toThrow(expectedError);

    });

    it("should not throw an error if all required forwardMigrations are available", () => {
        expect(
            () => tryThrowUpgradeFailed({
                forwardMigrations: [testMigration02],
                currentPosition: 1,
                targetPosition: 2
            })
        ).not.toThrowError();
    });

});
