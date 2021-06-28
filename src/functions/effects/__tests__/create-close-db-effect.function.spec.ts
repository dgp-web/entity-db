import { createCloseDbEffect } from "../create-close-db-effect.function";
import { Observable } from "rxjs";
import { CloseDbTimer, DbConnectionSource } from "../../../models";
import { createCloseDbTimer } from "../../factories/create-close-db-timer.function";
import { createDbConnectionSource } from "../../factories/create-db-connection-source.function";

describe("createCloseDbEffect", () => {

    let closeDbTimer$: CloseDbTimer;
    let dbConnectionSource$: DbConnectionSource;

    let effect: Observable<void>;


    beforeEach(() => {
        closeDbTimer$ = createCloseDbTimer();
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


});
