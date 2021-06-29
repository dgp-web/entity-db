import { Observable } from "rxjs";
import { TestCloseDbTimer } from "../../../__tests__/models/test-close-db-timer.model";
import { DbConnectionSource, PouchDbRef, ScheduledRequest } from "../../../models";
import * as PouchDB from "pouchdb";
import { createTestPouchDb } from "../../../__tests__/factories/create-test-pouch-db.function";
import { createTestCloseDbTimer } from "../../../__tests__/factories/create-test-close-db-timer.function";
import { createDbConnectionSource } from "../../factories/create-db-connection-source.function";
import {
    createProcessRequestEffect,
    processRequestEffectConfig,
    ProcessRequestEffectPayload
} from "../create-process-request-effect.function";
import { createTestRequestScheduler } from "../../../__tests__/factories/create-test-request-scheduler.function";
import { TestRequestScheduler } from "../../../__tests__/models/test-request-scheduler.model";
import { first } from "rxjs/operators";

export const testRequest: ScheduledRequest = {
    request$: dbc => Promise.resolve(),
    publishResult: payload => {
    },
    publishError: payload => {
    }
};

describe("createProcessRequestEffect", () => {

    let closeDbTimer$: TestCloseDbTimer;
    let dbConnectionSource$: DbConnectionSource;
    let requestScheduler$: TestRequestScheduler;

    let payload: ProcessRequestEffectPayload;

    let effect: Observable<void>;
    let dbConnection: PouchDB.Database;
    let dbRef: PouchDbRef;

    beforeEach(() => {
        dbConnection = createTestPouchDb();
        closeDbTimer$ = createTestCloseDbTimer();
        dbConnectionSource$ = createDbConnectionSource();
        requestScheduler$ = createTestRequestScheduler();
        dbRef = () => dbConnection;

        payload = {requestScheduler$, closeDbTimer$, dbConnectionSource$, dbRef};

        effect = createProcessRequestEffect(payload);
    });

    it(`should create`, () => {
        expect(effect).toBeDefined();
    });

    it(`and return an Observable`, () => {
        expect(effect instanceof Observable).toBeTruthy();
    });

    it(`that reacts when a request is scheduled is passed`, async () => {
        requestScheduler$.next(testRequest);
        await effect.pipe(first()).toPromise();
    });

    it(`and calls startRequest$ with the passed payload`, async () => {
        spyOn(processRequestEffectConfig, "startRequest$").and.callThrough();
        requestScheduler$.next(testRequest);
        await effect.pipe(first()).toPromise();
        expect(processRequestEffectConfig.startRequest$).toHaveBeenCalledWith(payload);
    });

});
