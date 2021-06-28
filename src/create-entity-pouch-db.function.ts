import {
    createCloseDbTimer,
    createDbConnectionSource,
    createDbWithRequestScheduler,
    createRequestScheduler,
    registerCloseTimer,
    registerRequestProcessor,
    tryPush
} from "./functions";
import { EntityDb, EntityPouchDbPayload, MigrationEntities } from "./models";
import { Many, Mutable } from "data-modeling";
import { entityPouchDbConfig } from "./constants";

export function createEntityPouchDb<TEntityTypeMap extends MigrationEntities>(
    payload: EntityPouchDbPayload<TEntityTypeMap>,
    config = entityPouchDbConfig
): EntityDb<TEntityTypeMap> {

    const dbRef = payload.dbRef;
    const entityTypes = payload.entityTypes as Mutable<Many<string>>;
    tryPush(entityTypes, "migrationInfo");
    const migrations = payload.migrations ? payload.migrations : [];

    const dbConnectionSource$ = createDbConnectionSource();
    const closeDbTimer$ = createCloseDbTimer();
    const requestScheduler$ = createRequestScheduler();

    if (typeof dbRef === "function") registerCloseTimer({closeDbTimer$, dbConnectionSource$});

    registerRequestProcessor({closeDbTimer$, dbConnectionSource$, requestScheduler$, dbRef}, config);

    return createDbWithRequestScheduler({requestScheduler$, migrations, entityTypes});
}
