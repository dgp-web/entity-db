import { DbConnectionSource } from "./db-connection-source.model";

export interface WithDbConnectionSource {
    readonly dbConnectionSource$: DbConnectionSource;
}
