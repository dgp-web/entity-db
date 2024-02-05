import { addReactiveChangesToCRUDEntityDb } from "../add-reactive-changes-to-crud-entity-db.function";
import { TestEntities } from "../../../__tests__/scenarios/migrations.function.spec";
import { ChangesPublishConfig, EntityDb } from "../../../models";
import { first } from "rxjs/operators";
import { testUser } from "../../../__tests__/constants/test-user.constant";
import { createTestEntityPouchDb } from "../../../__tests__/factories/create-test-entity-pouch-db.function";
import { cacheTestUser } from "../../../__tests__/actions/cache-test-user.action";
import { cacheTestUserAndLocation } from "../../../__tests__/actions/cache-test-user-and-location.action";
import { maskUserLabel } from "../../../__tests__/functions/mask-user-label.function";

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

        const action = cacheTestUser();

        db.getChanges$(null).pipe(
            first()
        ).subscribe(changes => {
            expect(changes).toEqual(action);
            done();
        });

        await db.dispatch$(action);

    });

    it(`should apply the changes publish config if one is given`, async (done) => {

        const action = cacheTestUserAndLocation();

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
