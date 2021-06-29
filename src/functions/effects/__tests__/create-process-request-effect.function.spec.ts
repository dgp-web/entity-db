import { Observable } from "rxjs";
import { TestCloseDbTimer } from "../../../__tests__/models/test-close-db-timer.model";
import { DbConnectionSource, PouchDbRef } from "../../../models";
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
import { ProcessRequestPayload } from "../../request-processing/process-request$";
import { entityPouchDbConfig } from "../../../constants";
import { testError } from "../../../__tests__/constants/test-error.constant";
import { testRequest } from "../../../__tests__/constants/test-request.constant";

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
        requestScheduler$.next(testRequest);
    });

    it(`should create`, () => {
        expect(effect).toBeDefined();
    });

    it(`and return an Observable`, () => {
        expect(effect instanceof Observable).toBeTruthy();
    });

    it(`that reacts when a request is scheduled is passed`, async () => {
        await effect.pipe(first()).toPromise();
    });

    it(`and calls startRequest$ with the passed payload`, async () => {
        spyOn(processRequestEffectConfig, "startRequest$").and.callThrough();
        await effect.pipe(first()).toPromise();
        expect(processRequestEffectConfig.startRequest$).toHaveBeenCalledWith(payload);
    });

    it(`and then calls processRequest$ with the passed payload`, async () => {
        spyOn(processRequestEffectConfig, "processRequest$").and.callThrough();
        await effect.pipe(first()).toPromise();
        expect(processRequestEffectConfig.processRequest$).toHaveBeenCalledWith({
            publishError: testRequest.publishError,
            publishResult: testRequest.publishResult,
            request$: testRequest.request$(dbConnection)
        } as ProcessRequestPayload<any>);
    });

    it(`and then calls finalizeRequest$ with the passed payload`, async () => {
        spyOn(processRequestEffectConfig, "finalizeRequest$").and.callThrough();
        await effect.pipe(first()).toPromise();
        expect(processRequestEffectConfig.finalizeRequest$).toHaveBeenCalledWith(payload, entityPouchDbConfig);
    });

    it(`and calls logError if startRequest$ throw an error`, async () => {
        spyOn(processRequestEffectConfig, "startRequest$").and.returnValue(Promise.reject(testError));
        spyOn(processRequestEffectConfig, "logError");
        await effect.pipe(first()).toPromise();
        expect(processRequestEffectConfig.logError).toHaveBeenCalledWith(testError);
    });

    it(`or if processRequest$ throw an error`, async () => {
        spyOn(processRequestEffectConfig, "processRequest$").and.returnValue(Promise.reject(testError));
        spyOn(processRequestEffectConfig, "logError");
        await effect.pipe(first()).toPromise();
        expect(processRequestEffectConfig.logError).toHaveBeenCalledWith(testError);
    });

    it(`or if finalizeRequest$ throw an error`, async () => {
        spyOn(processRequestEffectConfig, "finalizeRequest$").and.returnValue(Promise.reject(testError));
        spyOn(processRequestEffectConfig, "logError");
        await effect.pipe(first()).toPromise();
        expect(processRequestEffectConfig.logError).toHaveBeenCalledWith(testError);
    });

});
