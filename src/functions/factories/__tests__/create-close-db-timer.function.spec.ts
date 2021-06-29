import { Subject } from "rxjs";
import { createCloseDbTimer } from "../create-close-db-timer.function";

describe("createCloseDbTimer", () => {
    const service = createCloseDbTimer();

    it(`should create a subject for number`, () => {
        expect(service instanceof Subject).toBeTruthy();
    });

});
