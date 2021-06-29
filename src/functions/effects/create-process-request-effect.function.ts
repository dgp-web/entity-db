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

export const processRequestEffectConfig = {
    startRequest$,
    processRequest$,
    finalizeRequest$
};

export function createProcessRequestEffect(
    payload: ProcessRequestEffectPayload,
    config = entityPouchDbConfig,
    execConfig = processRequestEffectConfig
): Observable<void> {

    return payload.requestScheduler$.pipe(concatMap(x => {

        return execConfig.startRequest$(payload)
            .then(dbConnection => execConfig.processRequest$({
                request$: x.request$(dbConnection),
                publishResult: x.publishResult,
                publishError: x.publishError
            }))
            .then(() => execConfig.finalizeRequest$(payload, config))
            /**
             * We catch all errors in the chain to ensure that scheduler
             * cannot stop.
             */
            .catch(e => {
                console.error("DB error: ", e);
            });

    }));

}
