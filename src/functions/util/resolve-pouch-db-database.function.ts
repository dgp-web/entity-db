import { PouchDbRef } from "../../models";
import { resolveAsObject } from "./resolve-as-object.function";

export function resolvePouchDbDatabase(dbRef: PouchDbRef): PouchDB.Database {
    return resolveAsObject(dbRef);
}
