import { resolveAsObject } from "../resolve-as-object.function";
import { ObjectOrFactory } from "../../../models";

describe("resolveAsObject", () => {

    it(`should pass through objects`, () => {
        const payload: ObjectOrFactory<{}> = {};
        const result = resolveAsObject(payload);
        const expectedResult = {};
        expect(result).toEqual(expectedResult);
    });

    it(`and resolve functions`, () => {
        const payload: ObjectOrFactory<{}> = () => ({});
        const result = resolveAsObject(payload);
        const expectedResult = {};
        expect(result).toEqual(expectedResult);
    });

});
