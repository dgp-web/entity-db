import {testMigration02} from "../../../../__tests__/constants/test-migration-02.constant";
import {tryThrowDowngradeFailed} from "../try-throw-downgrade-failed.function";
import {createDowngradeFailedError} from "../../../errors/create-downgrade-failed-error.function";

describe("tryThrowDowngradeFailed", () => {

    it("should throw an error if not all required backwardMigrations are available", () => {

        const expectedError = createDowngradeFailedError({
            currentVersion: 3,
            targetVersion: 1
        });

        expect(
            () => tryThrowDowngradeFailed({
                backwardMigrations: [testMigration02],
                currentPosition: 3,
                targetPosition: 1
            })
        ).toThrow(expectedError);

    });

    it("should not throw an error if all required backwardMigrations are available", () => {
        expect(
            () => tryThrowDowngradeFailed({
                backwardMigrations: [testMigration02],
                currentPosition: 2,
                targetPosition: 1
            })
        ).not.toThrowError();
    });

});
