import { BehaviorSubject } from "rxjs";
import { DbConnectionInfo } from "../../models";
import { emptyConnectionInfo } from "../../constants";

export interface MarkDbConnectionAsClosedPayload {
    readonly dbConnectionSource$: BehaviorSubject<DbConnectionInfo>;
}

export function markDbConnectionAsClosed(payload: MarkDbConnectionAsClosedPayload): void {
    const dbConnectionSource$ = payload.dbConnectionSource$;
    dbConnectionSource$.next(emptyConnectionInfo)
}
