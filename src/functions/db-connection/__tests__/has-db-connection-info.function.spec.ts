import { hasDbConnectionInfo } from "../has-db-connection-info.function";
import { DbConnectionInfo } from "../../../models";

describe("hasDbConnectionInfo", () => {

    it(`should return false if isDbConnectionClosing is true`, () => {
        const payload: DbConnectionInfo = {
            dbConnection: {} as any,
            isDbConnectionClosing: true
        };
        expect(hasDbConnectionInfo(payload)).toBeFalsy();
    });

    it(`or if there is no connection`, () => {
        const payload: DbConnectionInfo = {
            dbConnection: null,
            isDbConnectionClosing: false
        };
        expect(hasDbConnectionInfo(payload)).toBeFalsy();
    });


    it(`or no connection info at all`, () => {
        const payload: DbConnectionInfo = null;
        expect(hasDbConnectionInfo(payload)).toBeFalsy();
    });

    it(`and else return true`, () => {
        const payload: DbConnectionInfo = {
            dbConnection: {} as any,
            isDbConnectionClosing: false
        };
        expect(hasDbConnectionInfo(payload)).toBeTruthy();
    });

});
