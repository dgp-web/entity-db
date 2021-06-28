import { EntityDb, Migration, MigrationEntities, WithRequestScheduler } from "../../models";
import { Many } from "data-modeling";
import { createCRUDEntityDb } from "./create-crud-entity-db.function";
import { initialize$, runMigrations$ } from "../core";

export interface CreateDbWithRequestSchedulerPayload extends WithRequestScheduler {
    readonly entityTypes: Many<string>;
    readonly migrations: Many<Migration<any, any>>;
}

export function createDbWithRequestScheduler<TEntityTypeMap extends MigrationEntities>(
    payload: CreateDbWithRequestSchedulerPayload
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
                await runMigrations$({db, migrations});
            }
        }
    } as EntityDb<TEntityTypeMap>;

    return db;
}
