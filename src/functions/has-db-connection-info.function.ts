import { DbConnectionInfo } from "../models";

export function hasDbConnectionInfo(payload: DbConnectionInfo): boolean {
    return !payload || !payload.dbConnection;
}
