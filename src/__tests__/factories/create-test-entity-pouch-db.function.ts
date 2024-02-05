import { createTestPouchDb } from "./create-test-pouch-db.function";
import { createEntityPouchDb } from "../../create-entity-pouch-db.function";
import { TestEntities } from "../scenarios/migrations.function.spec";
import { testMigration } from "../constants/test-migration.constant";

export function createTestEntityPouchDb() {
    const dbConnection = createTestPouchDb();
    const dbRef = () => dbConnection;

    return createEntityPouchDb<TestEntities>({
        dbRef,
        migrations: [testMigration],
        entityTypes: [
            "user",
            "location",
            "migrationInfo"
        ]
    });
}