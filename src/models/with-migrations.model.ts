import {Migration} from "./migration.model";

export interface WithMigrations {
    readonly migrations: ReadonlyArray<Migration<any, any>>;
}