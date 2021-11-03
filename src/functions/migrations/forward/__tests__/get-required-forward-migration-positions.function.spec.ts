import {getRequiredForwardMigrationPositions} from "../get-required-forward-migration-positions.function";

describe("getRequiredForwardMigrationPositions", () => {

    it("should get all numbers between currentPosition and targetPosition (including the latter)", () => {

        const result = getRequiredForwardMigrationPositions({
            currentPosition: 1,
            targetPosition: 3
        });

        expect(result).toEqual([2, 3]);

    });

});
