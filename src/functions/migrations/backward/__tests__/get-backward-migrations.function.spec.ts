import {testMigration} from "../../../../__tests__/constants/test-migration.constant";
import {testMigration02} from "../../../../__tests__/constants/test-migration-02.constant";
import {getBackwardMigrations} from "../get-backward-migrations.function";

describe("getBackwardMigrations", () => {

    it(`should return migrations with a lower position than the passed currentPosition and higher than or equal to the passed targetPosition`, () => {
        const result = getBackwardMigrations({
            migrations: [testMigration, testMigration02],
            targetPosition: 1,
            currentPosition: 2
        });
        const expectedResult = [testMigration02];
        expect(result).toEqual(expectedResult);
    });

    it(`should return an empty array if no results are found`, () => {
        const result = getBackwardMigrations({
            migrations: [testMigration, testMigration02],
            targetPosition: 2,
            currentPosition: 1
        });
        const expectedResult = [];
        expect(result).toEqual(expectedResult);
    });

});
