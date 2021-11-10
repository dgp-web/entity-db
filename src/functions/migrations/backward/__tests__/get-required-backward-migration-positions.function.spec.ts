import {getRequiredBackwardMigrationPositions} from "../get-required-backward-migration-positions.function";

describe("getRequiredBackwardMigrationPositions", () => {

    it("should get all numbers between targetPosition and currentPosition (including the former)", () => {

        const result = getRequiredBackwardMigrationPositions({
            currentPosition: 3,
            targetPosition: 1
        });

        expect(result).toEqual([3, 2]);

    });

});
