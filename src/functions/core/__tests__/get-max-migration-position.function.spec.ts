import {getMaxMigrationPosition} from "../get-max-migration-position.function";
import {testMigrationInfo} from "../../../__tests__/constants/test-migration-info.constant";

describe("getMaxMigrationPosition", () => {

    it(`should return the max of the passed migrationInfos' positions`, () => {
        const max = getMaxMigrationPosition({migrationInfos: [testMigrationInfo]})
        expect(max).toBe(testMigrationInfo.position);
    });

    it(`should return null if no migrationInfos are passed`, () => {
        const max = getMaxMigrationPosition({migrationInfos: []})
        expect(max).toBe(0);
    });

});
