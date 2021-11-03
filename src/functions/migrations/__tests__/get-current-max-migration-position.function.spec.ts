import {getCurrentMaxMigrationPosition} from "../get-current-max-migration-position.function";
import {testMigrationInfo} from "../../../__tests__/constants/test-migration-info.constant";
import {testMigrationInfo02} from "../../../__tests__/constants/test-migration-info-02.constant";

describe("getCurrentMaxMigrationPosition", () => {

    it(`should return the max of the passed migrationInfos' positions`, () => {
        const max = getCurrentMaxMigrationPosition({migrationInfos: [testMigrationInfo, testMigrationInfo02]})
        expect(max).toBe(testMigrationInfo02.position);
    });

    it(`should return null if no migrationInfos are passed`, () => {
        const max = getCurrentMaxMigrationPosition({migrationInfos: []})
        expect(max).toBe(0);
    });

});
