import {getMaxMigrationPosition} from "../get-max-migration-position.function";
import {testMigrationInfo} from "../../../__tests__/constants/test-migration-info.constant";
import {getTargetMigrationPosition} from "../get-target-migration-position.function";
import {testMigrationInfo02} from "../../../__tests__/constants/test-migration-info-02.constant";

describe("getTargetMigrationPosition", () => {

    it(`should return the max of the passed migrationInfos' positions if no targetMigrationId is passed`, () => {
        const result = getTargetMigrationPosition({migrationInfos: [testMigrationInfo, testMigrationInfo02]})
        const expectedResult = getMaxMigrationPosition({migrationInfos: [testMigrationInfo, testMigrationInfo02]});
        expect(result).toBe(expectedResult);
    });

    it(`and else return the position associated with the passed migration id`, () => {
        const result = getTargetMigrationPosition({migrationInfos: [testMigrationInfo, testMigrationInfo02]}, {
            targetMigrationId: testMigrationInfo.migrationId
        })
        const expectedResult = testMigrationInfo.position;
        expect(result).toBe(expectedResult);
    });

});
