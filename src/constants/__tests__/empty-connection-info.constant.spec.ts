import { emptyConnectionInfo } from "../empty-connection-info.constant";

describe("emptyConnectionInfo", () => {

    const model = emptyConnectionInfo;

    it(`dbConnection should be null`, () => {
        expect(model.dbConnection).toBeNull();
    });

    it(`isDbConnectionClosing should be false`, () => {
        expect(model.isDbConnectionClosing).toBeFalsy();
    });

});
