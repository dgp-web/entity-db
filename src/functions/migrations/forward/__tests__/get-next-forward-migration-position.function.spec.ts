import {getNextForwardMigrationPosition} from "../get-next-forward-migration-position.function";

describe("getNextForwardMigrationPosition", () => {

    const currentPosition = 1;

    it("should return currentPosition + (i+1)", () => {
        const result = getNextForwardMigrationPosition({
            currentPosition, i: 0
        });
        expect(result).toBe(2);
    });

});
