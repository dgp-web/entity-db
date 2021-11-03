import {createMigrationInfo} from "../../functions/factories/create-migration-info.function";
import {testMigration} from "./test-migration.constant";
import {testDateFactory} from "./test-date-factory.constant";
import {testMigration02} from "./test-migration-02.constant";

export const testMigrationInfo02 = createMigrationInfo(testMigration02, testDateFactory);
