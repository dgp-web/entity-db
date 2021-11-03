import {getMaxMigrationPosition} from "../get-max-migration-position.function";
import {testMigration} from "../../../__tests__/constants/test-migration.constant";
import {testMigration02} from "../../../__tests__/constants/test-migration-02.constant";

describe("getMaxMigrationPosition", () => {

    it(`should return the max of the passed migrations' positions`, () => {
        const max = getMaxMigrationPosition({migrations: [testMigration, testMigration02]})
        expect(max).toBe(testMigration02.position);
    });

    it(`should return null if no migrationInfos are passed`, () => {
        const max = getMaxMigrationPosition({migrations: []})
        expect(max).toBe(0);
    });

});
