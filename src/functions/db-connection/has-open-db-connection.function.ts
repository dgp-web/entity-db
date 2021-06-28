import { DbConnectionInfo } from "../../models";

export function hasOpenDbConnection(payload: DbConnectionInfo): boolean {
    if (payload === null || payload === undefined) return false;
    if (payload.dbConnection === null || payload.dbConnection === undefined) return false;
    if (payload.isDbConnectionClosing === true) return false;
    return true;
}
