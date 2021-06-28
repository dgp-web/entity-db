import { EntityDb, EntityPouchDbPayload, MigrationEntities } from "./models";
import { Many, Mutable } from "data-modeling";
import { entityPouchDbConfig } from "./constants";
import { createProcessRequestEffect } from "./functions/effects/create-process-request-effect.function";
import { createCloseDbEffect } from "./functions/effects/create-close-db-effect.function";
import { createDbWithRequestScheduler } from "./functions/factories/create-db-with-request-scheduler.function";
import { createCloseDbTimer } from "./functions/factories/create-close-db-timer.function";
import { createDbConnectionSource } from "./functions/factories/create-db-connection-source.function";
import { createRequestScheduler } from "./functions/factories/create-request-scheduler.function";
import { tryPush } from "./functions/util/try-push.function";

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

    // TODO: There is not error handler here!!!
    if (typeof dbRef === "function") createCloseDbEffect({closeDbTimer$, dbConnectionSource$}).subscribe();

    // TODO: There is not error handler here!!!
    createProcessRequestEffect({closeDbTimer$, dbConnectionSource$, requestScheduler$, dbRef}, config).subscribe();

    return createDbWithRequestScheduler({requestScheduler$, migrations, entityTypes});
}
