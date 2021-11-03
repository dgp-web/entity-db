import {testMigrationInfo} from "../../../__tests__/constants/test-migration-info.constant";
import {getTargetMigrationPosition} from "../get-target-migration-position.function";
import {getMaxMigrationPosition} from "../get-max-migration-position.function";
import {testMigration02} from "../../../__tests__/constants/test-migration-02.constant";
import {testMigration} from "../../../__tests__/constants/test-migration.constant";

describe("getTargetMigrationPosition", () => {

    it(`should return the max of the passed migrationInfos' positions if no targetMigrationId is passed`, () => {
        const result = getTargetMigrationPosition({migrations: [testMigration, testMigration02]})
        const expectedResult = getMaxMigrationPosition({migrations: [testMigration, testMigration02]});
        expect(result).toBe(expectedResult);
    });

    it(`and else return the position associated with the passed migration id`, () => {
        const result = getTargetMigrationPosition({migrations: [testMigration, testMigration02]}, {
            targetMigrationId: testMigrationInfo.migrationId
        })
        const expectedResult = testMigrationInfo.position;
        expect(result).toBe(expectedResult);
    });

});
