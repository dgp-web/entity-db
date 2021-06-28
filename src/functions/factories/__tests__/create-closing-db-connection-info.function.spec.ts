import { createClosingDbConnectionInfo } from "../create-closing-db-connection-info.function";

describe("createClosingDbConnectionInfo", () => {

    const dbConnection: PouchDB.Database = {} as any;
    const result = createClosingDbConnectionInfo(dbConnection);

    it(`should return a connection with the passed connection`, () => {
        expect(result.dbConnection).toBe(dbConnection);
    });

    it(`and isDbConnectionClosing set to true`, () => {
        expect(result.isDbConnectionClosing).toBeTruthy();
    });

});
