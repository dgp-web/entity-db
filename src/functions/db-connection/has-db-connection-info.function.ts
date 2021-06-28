import { DbConnectionInfo } from "../../models";

export function hasDbConnectionInfo(payload: DbConnectionInfo): boolean {
    if (payload === null || payload === undefined) return false;
    if (payload.dbConnection === null || payload.dbConnection === undefined) return false;
    return true;
}
