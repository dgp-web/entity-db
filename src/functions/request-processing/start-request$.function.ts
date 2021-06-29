import { PouchDbRef } from "../../models";
import { resolvePouchDbDatabase } from "../util/resolve-pouch-db-database.function";
import { filter, first } from "rxjs/operators";
import { WithDbConnectionSource } from "../../models/with-db-connection-source.model";
import { WithCloseDbTimer } from "../../models/with-close-db-timer.model";

export interface StartRequest$Payload extends WithDbConnectionSource, WithCloseDbTimer {
    readonly dbRef: PouchDbRef;
}

export async function startRequest$(payload: StartRequest$Payload): Promise<PouchDB.Database> {

    const dbRef = payload.dbRef;
    const dbConnectionSource$ = payload.dbConnectionSource$;
    const closeDbTimer$ = payload.closeDbTimer$;

    if (typeof dbRef === "object") return Promise.resolve(dbRef);

    let currentValue = dbConnectionSource$.value;

    if (currentValue?.isDbConnectionClosing) {
        currentValue = await dbConnectionSource$.pipe(
            filter(x => !x.isDbConnectionClosing),
            first()
        ).toPromise();
    }

    /**
     * Create a new db if none is existing
     */
    if (!currentValue || !currentValue.dbConnection) {
        currentValue = {
            dbConnection: resolvePouchDbDatabase(dbRef),
            isDbConnectionClosing: false
        };
        dbConnectionSource$.next(currentValue);
    }
    /**
     * Reset the closing timer
     */
    closeDbTimer$.next(null);
    return currentValue.dbConnection;

}
