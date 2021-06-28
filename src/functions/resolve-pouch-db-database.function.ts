import { PouchDbRef } from "../models";

export function resolvePouchDbDatabase(dbRef: PouchDbRef): PouchDB.Database {
    if (typeof dbRef === "object") return dbRef as PouchDB.Database;
    else if (typeof dbRef === "function") return dbRef();
}
