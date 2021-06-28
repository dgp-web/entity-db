import { CloseDbTimer, DbConnectionSource, PouchDbRef, RequestScheduler } from "../models";
import { entityPouchDbConfig } from "../constants";
import { Subscription } from "rxjs";
import { concatMap } from "rxjs/operators";
import { startRequest$ } from "./start-request$.function";
import { processRequest$ } from "./process-request$";
import { finalizeRequest$ } from "./finalize-request$.function";

export interface RegisterRequestProcessorPayload {
    readonly dbRef: PouchDbRef;
    readonly dbConnectionSource$: DbConnectionSource;
    readonly closeDbTimer$: CloseDbTimer;
    readonly requestScheduler$: RequestScheduler;
}

export function registerRequestProcessor(
    payload: RegisterRequestProcessorPayload,
    config = entityPouchDbConfig
): Subscription {

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

    })).subscribe();

}
