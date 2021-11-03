import {createMigrationInfo} from "../../functions/factories/create-migration-info.function";
import {testMigration} from "./test-migration.constant";
import {testDateFactory} from "./test-date-factory.constant";

export const testMigrationInfo = createMigrationInfo(testMigration, testDateFactory);
