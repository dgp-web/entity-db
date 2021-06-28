import { RequestScheduler, ScheduledRequest } from "../models";
import { Subject } from "rxjs";

export function createRequestScheduler(): RequestScheduler {
    return new Subject<ScheduledRequest>();
}
