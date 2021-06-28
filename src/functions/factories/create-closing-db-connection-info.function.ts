export function createClosingDbConnectionInfo(dbConnection: PouchDB.Database) {
    return {
        dbConnection, isDbConnectionClosing: true
    };
}
