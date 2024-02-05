import { addReactiveChangesToCRUDEntityDb } from "../add-reactive-changes-to-crud-entity-db.function";
import { createTestPouchDb } from "../../../__tests__/factories/create-test-pouch-db.function";
import { createTestRequestScheduler } from "../../../__tests__/factories/create-test-request-scheduler.function";
import { createEntityPouchDb } from "../../../create-entity-pouch-db.function";
import { testMigration } from "../../../__tests__/constants/test-migration.constant";
import { TestEntities } from "../../../__tests__/scenarios/migrations.function.spec";
import { EntityDb, PouchDbRef } from "../../../models";
import * as PouchDB from "pouchdb";
import { TestRequestScheduler } from "../../../__tests__/models/test-request-scheduler.model";
import { first } from "rxjs/operators";
import { TestEntityDbAction } from "../../../__tests__/models/test-entity-db-action.model";

describe("addReactiveChangesToCRUDEntityDb", () => {

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

    it(`should add a changes$ property`, () => {
        expect(db.changes$).toBeDefined();
    });

    it(`should decorate dispatch$ so changes are published via changes$`, async (done) => {

        const action: TestEntityDbAction = {
            add: {
                user: {
                    ["testUserId"]: {
                        userId: "testUserId",
                        label: "Test user"
                    }
                }
            }
        };

        db.changes$.pipe(
            first()
        ).subscribe(changes => {
            expect(changes).toEqual(action);
            done();
        });

        await db.dispatch$(action);

    });

});
