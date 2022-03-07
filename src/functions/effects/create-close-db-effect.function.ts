import {Observable} from "rxjs";
import {switchMap} from "rxjs/operators";
import {createClosingDbConnectionInfo} from "../factories/create-closing-db-connection-info.function";
import {hasOpenDbConnection} from "../db-connection/has-open-db-connection.function";
import {markDbConnectionAsClosed} from "../db-connection/mark-db-connection-as-closed.function";
import {ofNull} from "../util/of-null.function";
import {WithDbConnectionSource} from "../../models/with-db-connection-source.model";
import {WithCloseDbTimer} from "../../models/with-close-db-timer.model";
import {tryCreateTimer$} from "../util/try-create-timer$.function";
import {filterNotNull} from "../util/filter-not-null.function";

export interface CloseDbEffectPayload extends WithDbConnectionSource, WithCloseDbTimer {
}

export const createCloseDbEffectConfig = {
    markDbConnectionAsClosed
};

export function createCloseDbEffect(
    payload: CloseDbEffectPayload,
    config = createCloseDbEffectConfig
): Observable<void> {
    const closeDbTimer$ = payload.closeDbTimer$;
    const dbConnectionSource$ = payload.dbConnectionSource$;

    return closeDbTimer$.pipe(
        switchMap(tryCreateTimer$),
        filterNotNull(),
        switchMap(() => {
            const info = dbConnectionSource$.value
            if (!hasOpenDbConnection(info)) return ofNull<void>();

            const connection = info.dbConnection;
            dbConnectionSource$.next(createClosingDbConnectionInfo(connection));
            return connection.close().then(() => {
                return config.markDbConnectionAsClosed({dbConnectionSource$})
            });
        })
    );
}
