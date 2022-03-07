import {CRUDEntityDb, MigrationEntities, WithRequestScheduler} from "../../models";
import {createGet$Handler} from "../handlers/create-get$-handler.function";
import {createDispatch$Handler} from "../handlers/create-dispatch$-handler.function";
import {WithPouchDbRef} from "../effects/with-pouch-db-ref.model";
import {createClose$Handler} from "../handlers/create-close$-handler.function";
import {WithDbConnectionSource} from "../../models/with-db-connection-source.model";

export function createCRUDEntityDb<TEntityTypeMap extends MigrationEntities>(
    payload: WithRequestScheduler & WithPouchDbRef & WithDbConnectionSource
): CRUDEntityDb<TEntityTypeMap> {
    const requestScheduler$ = payload.requestScheduler$;
    const dbRef = payload.dbRef;
    const dbConnectionSource$ = payload.dbConnectionSource$;

    return {
        get$: createGet$Handler<TEntityTypeMap>({requestScheduler$}),
        dispatch$: createDispatch$Handler<TEntityTypeMap>({requestScheduler$}),
        close$: createClose$Handler({dbRef, dbConnectionSource$})
    };
}
