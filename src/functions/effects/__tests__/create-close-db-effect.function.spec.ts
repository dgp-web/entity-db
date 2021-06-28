import {createCloseDbEffect, createCloseDbEffectConfig} from "../create-close-db-effect.function";
import {Observable} from "rxjs";
import {DbConnectionInfo, DbConnectionSource} from "../../../models";
import {createDbConnectionSource} from "../../factories/create-db-connection-source.function";
import {first} from "rxjs/operators";
import {createClosingDbConnectionInfo} from "../../factories/create-closing-db-connection-info.function";
import * as PouchDB from "pouchdb";
import {createTestPouchDb} from "../../../__tests__/factories/create-test-pouch-db.function";
import {TestCloseDbTimer} from "../../../__tests__/models/test-close-db-timer.model";
import {createTestCloseDbTimer} from "../../../__tests__/factories/create-test-close-db-timer.function";

describe("createCloseDbEffect", () => {

    let closeDbTimer$: TestCloseDbTimer;
    let dbConnectionSource$: DbConnectionSource;

    let effect: Observable<void>;
    let dbConnection: PouchDB.Database;

    beforeEach(() => {
        dbConnection = createTestPouchDb();
        closeDbTimer$ = createTestCloseDbTimer();
        dbConnectionSource$ = createDbConnectionSource();

        effect = createCloseDbEffect({closeDbTimer$, dbConnectionSource$});
    });

    it(`should create`, () => {
        expect(effect).toBeDefined();
    });

    it(`should return an Observable`, () => {
        expect(effect instanceof Observable).toBeTruthy();
    });

    it(`that reacts when a closeDbTimer is passed`, (done) => {
        effect.subscribe(() => done());
        closeDbTimer$.next(0);
    });

    it(`and calls dbConnectionSource$.next with createClosingDbConnectionInfo if there is a db connection`, async () => {
        const info: DbConnectionInfo = {
            dbConnection,
            isDbConnectionClosing: false
        };
        dbConnectionSource$.next(info);
        closeDbTimer$.next(0);
        spyOn(dbConnectionSource$, "next").and.callThrough();
        await effect.pipe(first()).toPromise();
        expect(dbConnectionSource$.next).toHaveBeenCalledWith(createClosingDbConnectionInfo(info.dbConnection));
    });

    it(`and then call dbConnection.close`, async () => {
        const info: DbConnectionInfo = {
            dbConnection,
            isDbConnectionClosing: false
        };
        dbConnectionSource$.next(info);
        closeDbTimer$.next(0);
        spyOn(dbConnection, "close").and.callThrough();
        await effect.pipe(first()).toPromise();
        expect(dbConnection.close).toHaveBeenCalled();
    });

    it(`and then call markDbConnectionAsClosed with dbConnectionSource$`, async () => {
        const info: DbConnectionInfo = {
            dbConnection,
            isDbConnectionClosing: false
        };
        dbConnectionSource$.next(info);
        closeDbTimer$.next(0);
        spyOn(createCloseDbEffectConfig, "markDbConnectionAsClosed").and.callThrough();
        await effect.pipe(first()).toPromise();
        expect(createCloseDbEffectConfig.markDbConnectionAsClosed).toHaveBeenCalledWith({dbConnectionSource$});
    });

});
