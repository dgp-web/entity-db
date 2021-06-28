
export interface DbConnectionInfo {
    readonly dbConnection: PouchDB.Database;
    readonly isDbConnectionClosing: boolean;
}
