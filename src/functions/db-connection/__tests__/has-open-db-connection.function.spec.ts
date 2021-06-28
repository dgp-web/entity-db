import { hasOpenDbConnection } from "../has-open-db-connection.function";
import { DbConnectionInfo } from "../../../models";

describe("hasOpenDbConnection", () => {

    it(`should return false if isDbConnectionClosing is true`, () => {
        const payload: DbConnectionInfo = {
            dbConnection: {} as any,
            isDbConnectionClosing: true
        };
        expect(hasOpenDbConnection(payload)).toBeFalsy();
    });

    it(`or if there is no connection`, () => {
        const payload: DbConnectionInfo = {
            dbConnection: null,
            isDbConnectionClosing: false
        };
        expect(hasOpenDbConnection(payload)).toBeFalsy();
    });


    it(`or no connection info at all`, () => {
        const payload: DbConnectionInfo = null;
        expect(hasOpenDbConnection(payload)).toBeFalsy();
    });

    it(`and else return true`, () => {
        const payload: DbConnectionInfo = {
            dbConnection: {} as any,
            isDbConnectionClosing: false
        };
        expect(hasOpenDbConnection(payload)).toBeTruthy();
    });

});
