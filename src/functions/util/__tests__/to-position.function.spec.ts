import {FirstArg} from "../first-arg.model";
import {toPosition} from "../to-position.function";

describe("toPosition", () => {

    it(`should return the position attribute of the passed payload`, () => {
        const payload: FirstArg<typeof toPosition> = {position: 1};
        const result = toPosition(payload);
        expect(result).toBe(payload.position);
    });

});
