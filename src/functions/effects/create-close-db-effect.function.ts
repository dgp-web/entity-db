import { Observable, timer } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
import { createClosingDbConnectionInfo } from "../factories/create-closing-db-connection-info.function";
import { hasOpenDbConnection } from "../db-connection/has-open-db-connection.function";
import { markDbConnectionAsClosed } from "../db-connection/mark-db-connection-as-closed.function";
import { ofNull } from "../util/of-null.function";
import { WithDbConnectionSource } from "../../models/with-db-connection-source.model";
import { WithCloseDbTimer } from "../../models/with-close-db-timer.model";

export interface CloseDbEffectPayload extends WithDbConnectionSource, WithCloseDbTimer {
}

export function createCloseDbEffect(payload: CloseDbEffectPayload): Observable<void> {
    const closeDbTimer$ = payload.closeDbTimer$;
    const dbConnectionSource$ = payload.dbConnectionSource$;

    /**
     * Register close timer
     */
    return closeDbTimer$.pipe(
        switchMap(period => {
            if (period === null) return ofNull();
            return timer(period);
        }),
        filter(x => x !== null),
        switchMap(() => {
            if (!hasOpenDbConnection(dbConnectionSource$.value)) return ofNull<void>();

            dbConnectionSource$.next(createClosingDbConnectionInfo(dbConnectionSource$.value.dbConnection));
            return dbConnectionSource$.value.dbConnection.close().then(() => markDbConnectionAsClosed({
                dbConnectionSource$
            }));
        })
    );
}
