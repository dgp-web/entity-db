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
import { noopHandler } from "./functions/util/noop-handler.function";

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

    if (typeof dbRef === "function") {
        createCloseDbEffect({closeDbTimer$, dbConnectionSource$})
            .subscribe(
                noopHandler,
                e => console.error("Critical DB close effect error: ", e),
                () => console.error("Critical DB close effect completion")
            );
    }

    createProcessRequestEffect({closeDbTimer$, dbConnectionSource$, requestScheduler$, dbRef}, config)
        .subscribe(
            noopHandler,
            e => console.error("Critical DB processing effect error: ", e),
            () => console.error("Critical DB processing effect completion")
        );

    return createDbWithRequestScheduler({requestScheduler$, migrations, entityTypes});
}
