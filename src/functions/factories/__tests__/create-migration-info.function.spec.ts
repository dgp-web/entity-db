import {MigrationInfo} from "../../../models";
import {createMigrationInfo} from "../create-migration-info.function";
import {testDateFactory} from "../../../__tests__/constants/test-date-factory.constant";
import {testMigration} from "../../../__tests__/constants/test-migration.constant";

describe("createMigrationInfo", () => {

    const migration = testMigration;

    it(`should create a MigrationInfo for a given Migration`, () => {
        const info = createMigrationInfo(migration, testDateFactory);
        const expectedInfo: MigrationInfo = {
            label: testMigration.label,
            position: testMigration.position,
            description: testMigration.description,
            migrationId: testMigration.migrationId,
            executionDate: testDateFactory.createDate().valueOf()
        };
        expect(info).toEqual(expectedInfo);
    });

});
