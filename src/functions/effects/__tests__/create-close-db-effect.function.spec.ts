import { createCloseDbEffect } from "../create-close-db-effect.function";
import { Observable, ReplaySubject } from "rxjs";
import { DbConnectionInfo, DbConnectionSource } from "../../../models";
import { createDbConnectionSource } from "../../factories/create-db-connection-source.function";
import { first } from "rxjs/operators";
import { createClosingDbConnectionInfo } from "../../factories/create-closing-db-connection-info.function";
import * as PouchDB from "pouchdb";

const uuidv4 = require("uuid/v4");

export function createGuid() {
    return uuidv4();
}

export type TestCloseDbTimer = ReplaySubject<number>;

export function createTestCloseDbTimer(): TestCloseDbTimer {
    return new ReplaySubject<number>(1);
}

PouchDB.plugin(require("pouchdb-adapter-memory"));

export function createTestPouchDb(): PouchDB.Database {
    return new PouchDB(createGuid(), {adapter: "memory"});
}

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


});
