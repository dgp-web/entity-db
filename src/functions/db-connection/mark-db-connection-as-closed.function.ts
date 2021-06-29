import { emptyConnectionInfo } from "../../constants";
import { WithDbConnectionSource } from "../../models/with-db-connection-source.model";

export function markDbConnectionAsClosed(payload: WithDbConnectionSource): void {
    const dbConnectionSource$ = payload.dbConnectionSource$;
    dbConnectionSource$.next(emptyConnectionInfo);
}
