import {TestCloseDbTimer} from "../models/test-close-db-timer.model";
import {ReplaySubject} from "rxjs";

export function createTestCloseDbTimer(): TestCloseDbTimer {
    return new ReplaySubject<number>(1);
}
