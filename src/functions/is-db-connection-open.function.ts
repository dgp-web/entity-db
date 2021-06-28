import { DbConnectionInfo } from "../models";

export function isDbConnectionOpen(x: DbConnectionInfo) {
    return x !== null
        && x.dbConnection !== null
        && x.isDbConnectionClosing !== true
}
