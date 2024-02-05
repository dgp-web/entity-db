import {TestRequestScheduler} from "../models/test-request-scheduler.model";
import {createTestRequestScheduler} from "../factories/create-test-request-scheduler.function";
import {EntityDb, MigrationEntities, PouchDbRef} from "../../models";
import {testMigration} from "../constants/test-migration.constant";
import * as PouchDB from "pouchdb";
import {createTestPouchDb} from "../factories/create-test-pouch-db.function";
import {createEntityPouchDb} from "../../create-entity-pouch-db.function";

export interface User {
    readonly userId: string;
    readonly label: string;
}

export interface Location {
    readonly locationId: string;
    readonly label: string;
}

export interface TestEntities extends MigrationEntities {
    readonly user: User;
    readonly location: Location;
}

describe("Migration scenario", () => {

    let db: EntityDb<TestEntities>;
    let dbConnection: PouchDB.Database;

    let dbRef: PouchDbRef;

    let requestScheduler$: TestRequestScheduler;

    beforeEach(async () => {
        dbConnection = createTestPouchDb();
        dbRef = () => dbConnection;
        requestScheduler$ = createTestRequestScheduler();

        db = createEntityPouchDb<TestEntities>({
            dbRef,
            migrations: [testMigration],
            entityTypes: [
                "user",
                "migrationInfo"
            ]
        });

        await db.initialize$();
    });

    it("should create", () => {
        expect(db).toBeDefined();
    });

});
