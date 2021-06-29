import { DbConnectionInfo, PouchDbRef } from "../../models";
import { BehaviorSubject, Subject } from "rxjs";
import { resolvePouchDbDatabase } from "../util/resolve-pouch-db-database.function";
import { filter, first, map } from "rxjs/operators";
import { hasOpenDbConnection } from "../db-connection/has-open-db-connection.function";

export interface StartRequest$Payload {
    readonly dbRef: PouchDbRef;
    readonly dbConnectionSource$: BehaviorSubject<DbConnectionInfo>;
    readonly closeDbTimer$: Subject<number>;
}

export function startRequest$(payload: StartRequest$Payload): Promise<PouchDB.Database> {

    const dbRef = payload.dbRef;
    const currentDbInstance$ = payload.dbConnectionSource$;
    const closeDbTimer$ = payload.closeDbTimer$;

    if (typeof dbRef === "object") return Promise.resolve(dbRef);

    const currentValue = currentDbInstance$.value;

    /**
     * Create a new db if none is existing but do nothing if we
     * are still closing
     */
    if (!currentValue || !currentValue.dbConnection) {
        currentDbInstance$.next({
            dbConnection: resolvePouchDbDatabase(dbRef),
            isDbConnectionClosing: false
        });
    }
    /**
     * Reset the closing timer
     */
    closeDbTimer$.next(null);

    return currentDbInstance$.pipe(
        /**
         * Only pass through new values if we have a db
         * that is not closing
         */
        filter(hasOpenDbConnection),
        map(x => x.dbConnection),
        first()
    ).toPromise();

}
