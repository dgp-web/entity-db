import { migrationConfig } from "../migration-config.constant";

describe("migrationConfig", () => {

    const config = migrationConfig;

    it(`targetMigrationId should be undefined`, () => {
        expect(config.targetMigrationId).toBeUndefined();
    });

    it(`disableAutoMigrations should be undefined`, () => {
        expect(config.disableAutoMigrations).toBeUndefined();
    });

});
