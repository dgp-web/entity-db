import { ScheduledRequest } from "../../models";
import { ReplaySubject } from "rxjs";
import { TestRequestScheduler } from "../models/test-request-scheduler.model";

export function createTestRequestScheduler(): TestRequestScheduler {
    return new ReplaySubject<ScheduledRequest>(1);
}
