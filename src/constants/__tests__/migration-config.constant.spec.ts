import { entityPouchDbConfig } from "../entity-pouch-db-config.constant";

describe("entityPouchDbConfig", () => {

    const config = entityPouchDbConfig;

    it(`keepIdleConnectionAlivePeriod should be 5000`, () => {
        expect(config.keepIdleConnectionAlivePeriod).toBe(5000);
    });


});
