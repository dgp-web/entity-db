import { createDbConnectionSource } from "../create-db-connection-source.function";
import { BehaviorSubject } from "rxjs";

describe("createDbConnectionSource", () => {

    const service = createDbConnectionSource();

    it(`should create a BehaviorSubject for DbConnectionInfo`, () => {
        expect(service instanceof BehaviorSubject).toBeTruthy();
    });

});
