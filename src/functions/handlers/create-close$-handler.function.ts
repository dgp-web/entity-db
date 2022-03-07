import {WithPouchDbRef} from "../effects/with-pouch-db-ref.model";
import {resolvePouchDbDatabase} from "../util/resolve-pouch-db-database.function";
import {WithDbConnectionSource} from "../../models/with-db-connection-source.model";
import {createClosingDbConnectionInfo} from "../factories/create-closing-db-connection-info.function";

export function createClose$Handler(payload: WithPouchDbRef & WithDbConnectionSource) {
    return () => {
        const dbRef = resolvePouchDbDatabase(payload.dbRef);
        payload.dbConnectionSource$.next(createClosingDbConnectionInfo(dbRef));
        return dbRef.close();
    };
}