import * as PouchDB from "pouchdb";
import {createGuid} from "./create-guid.function";

PouchDB.plugin(require("pouchdb-adapter-memory"));

export function createTestPouchDb(): PouchDB.Database {
    return new PouchDB(createGuid(), {adapter: "memory"});
}