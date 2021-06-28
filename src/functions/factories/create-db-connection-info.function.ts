export function createDbConnectionInfo(dbConnection: PouchDB.Database) {
    return {
        dbConnection, isDbConnectionClosing: true
    };
}
