import { addReactiveChangesToCRUDEntityDb } from "../add-reactive-changes-to-crud-entity-db.function";
import { TestEntities, User } from "../../../__tests__/scenarios/migrations.function.spec";
import { ChangesPublishConfig, EntityDb } from "../../../models";
import { first } from "rxjs/operators";
import { TestEntityDbAction } from "../../../__tests__/models/test-entity-db-action.model";
import { testUser } from "../../../__tests__/constants/test-user.constant";
import { testLocation } from "../../../__tests__/constants/test-location.constant";
import { createTestEntityPouchDb } from "../../../__tests__/factories/create-test-entity-pouch-db.function";

describe("addReactiveChangesToCRUDEntityDb", () => {

    let db: EntityDb<TestEntities>;

    beforeEach(async () => {
        db = createTestEntityPouchDb();

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
                    [testLocation.locationId]: testLocation
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
