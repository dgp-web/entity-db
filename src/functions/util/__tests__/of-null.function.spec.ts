import { ofNull } from "../of-null.function";
import { of } from "rxjs";

describe("ofNull", () => {

    it(`should equal of(null)`, async () => {
        const a = await ofNull().toPromise();
        const b = await of(null).toPromise();
        expect(a).toEqual(b);
    });

});
