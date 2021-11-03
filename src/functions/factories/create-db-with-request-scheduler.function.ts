import {EntityDb, MigrationEntities, WithMigrations, WithRequestScheduler} from "../../models";
import {Many} from "data-modeling";
import {createCRUDEntityDb} from "./create-crud-entity-db.function";
import {initialize$} from "../core/initialize$";
import {runMigrations$} from "../core/run-migrations$.function";
import {migrationConfig} from "../../constants";

export interface CreateDbWithRequestSchedulerPayload extends WithRequestScheduler, WithMigrations {
    readonly entityTypes: Many<string>;
}

export function createDbWithRequestScheduler<TEntityTypeMap extends MigrationEntities>(
    payload: CreateDbWithRequestSchedulerPayload,
    config = migrationConfig
): EntityDb<TEntityTypeMap> {

    const entityTypes = payload.entityTypes;
    const requestScheduler$ = payload.requestScheduler$;
    const migrations = payload.migrations;

    const crudDb = createCRUDEntityDb<TEntityTypeMap>({requestScheduler$});

    const db = {
        ...crudDb,
        initialize$: async () => {
            await new Promise((resolve, reject) => requestScheduler$.next({
                request$: dbConnection => initialize$(dbConnection, entityTypes as Array<string>),
                publishResult: resolve,
                publishError: reject
            }));
            if (migrations.length > 0) {
                await runMigrations$({db, migrations}, config);
            }
        }
    } as EntityDb<TEntityTypeMap>;

    return db;
}
