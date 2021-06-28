import { createCloseDbEffect } from "../create-close-db-effect.function";
import { Subscription } from "rxjs";
import { CloseDbTimer, DbConnectionSource } from "../../../models";
import { createCloseDbTimer } from "../../factories/create-close-db-timer.function";
import { createDbConnectionSource } from "../../factories/create-db-connection-source.function";

describe("createCloseDbEffect", () => {

    let closeDbTimer$: CloseDbTimer;
    let dbConnectionSource$: DbConnectionSource;

    let effect: Subscription;


    beforeEach(() => {
        closeDbTimer$ = createCloseDbTimer();
        dbConnectionSource$ = createDbConnectionSource();

        effect = createCloseDbEffect({closeDbTimer$, dbConnectionSource$});
    });

    it(`should create`, () => {
        expect(effect).toBeDefined();
    });


});
