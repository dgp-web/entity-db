import { PouchDbRef, WithRequestScheduler } from "../../models";
import { entityPouchDbConfig } from "../../constants";
import { Observable } from "rxjs";
import { concatMap } from "rxjs/operators";
import { startRequest$ } from "../request-processing/start-request$.function";
import { processRequest$ } from "../request-processing/process-request$";
import { finalizeRequest$ } from "../request-processing/finalize-request$.function";
import { WithDbConnectionSource } from "../../models/with-db-connection-source.model";
import { WithCloseDbTimer } from "../../models/with-close-db-timer.model";

export interface ProcessRequestEffectPayload extends WithRequestScheduler, WithDbConnectionSource, WithCloseDbTimer {
    readonly dbRef: PouchDbRef;
}

export function createProcessRequestEffect(
    payload: ProcessRequestEffectPayload,
    config = entityPouchDbConfig
): Observable<void> {

    const dbRef = payload.dbRef;
    const dbConnectionSource$ = payload.dbConnectionSource$;
    const closeDbTimer$ = payload.closeDbTimer$;
    const requestScheduler$ = payload.requestScheduler$;

    return requestScheduler$.pipe(concatMap(x => {

        return startRequest$({dbRef, closeDbTimer$, currentDbInstance$: dbConnectionSource$})
            .then(dbConnection => processRequest$({
                dbConnection,
                request$: x.request$(dbConnection),
                publishResult: x.publishResult,
                publishError: x.publishError
            }))
            .then(() => finalizeRequest$({closeDbTimer$}, config))
            /**
             * We catch all errors in the chain to ensure that scheduler
             * cannot stop.
             */
            .catch(e => {
                console.error("DB error: ", e);
            });

    }));

}
