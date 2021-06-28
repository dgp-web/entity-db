import { WithDbConnectionSource } from "../../../models/with-db-connection-source.model";
import { createDbConnectionSource } from "../../factories/create-db-connection-source.function";
import { emptyConnectionInfo } from "../../../constants";
import { markDbConnectionAsClosed } from "../mark-db-connection-as-closed.function";

describe("markDbConnectionAsClosed", () => {

    it(`should call dbConnectionSource$.next( with emptyConnectionInfo`, () => {
        const payload: WithDbConnectionSource = {
            dbConnectionSource$: createDbConnectionSource()
        };
        spyOn(payload.dbConnectionSource$, "next");
        markDbConnectionAsClosed(payload);
        expect(payload.dbConnectionSource$.next).toHaveBeenCalledWith(emptyConnectionInfo);
    });

});
