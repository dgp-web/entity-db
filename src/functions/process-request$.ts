import { from, Observable } from "rxjs";
import { defaultIfEmpty, first, tap } from "rxjs/operators";

export interface ProcessRequestPayload<T> {
    readonly request$: Promise<T> | Observable<T>;
    readonly dbConnection: PouchDB.Database;
    readonly publishResult: (payload?: any) => void;
    readonly publishError: (payload?: any) => void;
}

/**
 * Observes a promise or observable based
 * request
 *
 * Allows intercepting value and error events
 * with a custom observer
 */
export function processRequest$<T>(payload: ProcessRequestPayload<T>): Promise<T> {

    const request = payload.request$;

    let obs$: Observable<any>;

    if (request instanceof Promise) {
        obs$ = from(request as Promise<any>);
    } else {
        obs$ = request as Observable<any>;
    }

    let interceptedObs$ = obs$;

    interceptedObs$ = interceptedObs$.pipe(
        tap(value => payload.publishResult(value),
            e => payload.publishError(e),
            () => payload.publishResult()
        ),
        /* switchMap(() => payload.dbConnection.close()),
         catchError((err, caught) => {
             return payload.dbConnection.close().then(() => empty());
         }),*/
        defaultIfEmpty(null)
    );

    return interceptedObs$.pipe(
        first()
    ).toPromise();

}
