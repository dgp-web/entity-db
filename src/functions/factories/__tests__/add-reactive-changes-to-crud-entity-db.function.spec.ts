import { addReactiveChangesToCRUDEntityDb } from "../add-reactive-changes-to-crud-entity-db.function";
import { createTestPouchDb } from "../../../__tests__/factories/create-test-pouch-db.function";
import { createTestRequestScheduler } from "../../../__tests__/factories/create-test-request-scheduler.function";
import { createEntityPouchDb } from "../../../create-entity-pouch-db.function";
import { testMigration } from "../../../__tests__/constants/test-migration.constant";
import { TestEntities, User } from "../../../__tests__/scenarios/migrations.function.spec";
import { ChangesPublishConfig, EntityDb, PouchDbRef } from "../../../models";
import * as PouchDB from "pouchdb";
import { TestRequestScheduler } from "../../../__tests__/models/test-request-scheduler.model";
import { first } from "rxjs/operators";
import { TestEntityDbAction } from "../../../__tests__/models/test-entity-db-action.model";
import { testUser } from "../../../__tests__/constants/test-user.constant";

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
                "location",
                "migrationInfo"
            ]
        });

        await db.initialize$();
    });

    it(`should add a changes$ property`, () => {
        expect(db.getChanges$).toBeDefined();
    });

    it(`should decorate dispatch$ so changes are published via changes$`, async (done) => {

        const action: TestEntityDbAction = {
            add: {
                user: {
                    [testUser.userId]: testUser
                }
            }
        };

        db.getChanges$(null).pipe(
            first()
        ).subscribe(changes => {
            expect(changes).toEqual(action);
            done();
        });

        await db.dispatch$(action);

    });

    it(`should apply the changes publish config if one is given`, async (done) => {

        
        const action: TestEntityDbAction = {
            add: {
                user: {
                    [testUser.userId]: testUser
                },
                location: {
                    ["test"]: {
                        locationId: "test",
                        label: ""
                    }
                }
            }
        };

        const maskUserLabel = (user: User): User => {
            return {
                ...user,
                label: "<Secret>"
            }
        };

        const config: ChangesPublishConfig<TestEntities> = {
            whitelistedEntities: [
                "user"
            ],
            maskingRules: {
                user: maskUserLabel
            }
        }

        db.getChanges$(config).pipe(
            first()
        ).subscribe(changes => {
            expect(changes.add["location"]).not.toBeDefined();
            expect(changes.add["user"]).toEqual({
                [testUser.userId]: {
                    ...testUser,
                    label: "<Secret>"
                }
            });

            done();
        });

        await db.dispatch$(action);

    });

});
