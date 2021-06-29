import { DbConnectionInfo } from "../models";

export const emptyConnectionInfo: DbConnectionInfo = {
    dbConnection: null,
    isDbConnectionClosing: false
};
