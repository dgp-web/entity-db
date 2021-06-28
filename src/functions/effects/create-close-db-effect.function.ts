import { CloseDbTimer, DbConnectionSource } from "../../models";
import { Subscription, timer } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
import { createDbConnectionInfo } from "../factories/create-db-connection-info.function";
import { hasOpenDbConnection } from "../db-connection/has-open-db-connection.function";
import { markDbConnectionAsClosed } from "../db-connection/mark-db-connection-as-closed.function";
import { ofNull } from "../util/of-null.function";

export interface CloseDbEffectPayload {
    readonly closeDbTimer$: CloseDbTimer;
    readonly dbConnectionSource$: DbConnectionSource;
}

export function createCloseDbEffect(payload: CloseDbEffectPayload): Subscription {
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
            if (!hasOpenDbConnection(dbConnectionSource$.value)) return ofNull();

            /**
             * Mark DB as closing
             */
            dbConnectionSource$.next(createDbConnectionInfo(dbConnectionSource$.value.dbConnection));
            return dbConnectionSource$.value.dbConnection.close().then(() => markDbConnectionAsClosed({
                dbConnectionSource$
            }));
        })
    ).subscribe();
}
