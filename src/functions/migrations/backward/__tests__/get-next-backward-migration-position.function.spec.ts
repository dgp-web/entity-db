import {getNextBackwardMigrationPosition} from "../get-next-backward-migration-position.function";

describe("getNextBackwardMigrationPosition", () => {

    const currentPosition = 2;

    it("should return currentPosition - (i+1)", () => {
        const result = getNextBackwardMigrationPosition({
            currentPosition, i: 0
        });
        expect(result).toBe(1);
    });

});
