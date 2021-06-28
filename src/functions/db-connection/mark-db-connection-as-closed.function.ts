import { BehaviorSubject } from "rxjs";
import { emptyConnectionInfo } from "../../constants";
import { DbConnectionInfo } from "../../models";

export interface MarkDbConnectionAsClosedPayload {
    readonly dbConnectionSource$: BehaviorSubject<DbConnectionInfo>;
}

export function markDbConnectionAsClosed(payload: MarkDbConnectionAsClosedPayload): void {
    const dbConnectionSource$ = payload.dbConnectionSource$;
    dbConnectionSource$.next(emptyConnectionInfo)
}
