import { tryPush } from "../try-push.function";

describe("tryPush", () => {
    const item = "Test";

    it(`should add an item to an array if it's not already included`, () => {
        const collection = [];
        tryPush(collection, item);
        expect(collection).toContain(item);
    });

    it(`and not add it twice`, () => {
        const collection = [];
        tryPush(collection, item);
        tryPush(collection, item);
        expect(collection.length).toBe(1);
    });

});
