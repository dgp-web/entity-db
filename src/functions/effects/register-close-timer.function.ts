import { CloseDbTimer, DbConnectionSource } from "../../models";
import { Subscription, timer } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
import { ofNull } from "../util";
import { hasDbConnectionInfo, markDbConnectionAsClosed } from "../db-connection";
import { createDbConnectionInfo } from "../factories";

export interface RegisterCloseTimer {
    readonly closeDbTimer$: CloseDbTimer;
    readonly dbConnectionSource$: DbConnectionSource;
}

export function registerCloseTimer(payload: RegisterCloseTimer): Subscription {
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
            if (!hasDbConnectionInfo(dbConnectionSource$.value)) return ofNull();

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
