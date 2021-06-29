import { Observable } from "rxjs";
import { TestCloseDbTimer } from "../../../__tests__/models/test-close-db-timer.model";
import { DbConnectionSource, PouchDbRef, RequestScheduler } from "../../../models";
import * as PouchDB from "pouchdb";
import { createTestPouchDb } from "../../../__tests__/factories/create-test-pouch-db.function";
import { createTestCloseDbTimer } from "../../../__tests__/factories/create-test-close-db-timer.function";
import { createDbConnectionSource } from "../../factories/create-db-connection-source.function";
import { createProcessRequestEffect } from "../create-process-request-effect.function";
import { createRequestScheduler } from "../../factories/create-request-scheduler.function";

describe("createProcessRequestEffect", () => {

    let closeDbTimer$: TestCloseDbTimer;
    let dbConnectionSource$: DbConnectionSource;
    let requestScheduler$: RequestScheduler;

    let effect: Observable<void>;
    let dbConnection: PouchDB.Database;
    let dbRef: PouchDbRef;

    beforeEach(() => {
        dbConnection = createTestPouchDb();
        closeDbTimer$ = createTestCloseDbTimer();
        dbConnectionSource$ = createDbConnectionSource();
        requestScheduler$ = createRequestScheduler();
        dbRef = () => dbConnection;

        effect = createProcessRequestEffect({requestScheduler$, closeDbTimer$, dbConnectionSource$, dbRef});
    });

    it(`should create`, () => {
        expect(effect).toBeDefined();
    });


});
