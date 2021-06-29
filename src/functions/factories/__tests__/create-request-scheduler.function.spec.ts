import { createRequestScheduler } from "../create-request-scheduler.function";
import { Subject } from "rxjs";

describe("createRequestScheduler", () => {

    const service = createRequestScheduler();

    it(`should create a subject for ScheduledRequest`, () => {
        expect(service instanceof Subject).toBeTruthy();
    });

});
