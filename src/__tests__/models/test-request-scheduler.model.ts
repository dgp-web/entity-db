import { ReplaySubject } from "rxjs";
import { ScheduledRequest } from "../../models";

export type TestRequestScheduler = ReplaySubject<ScheduledRequest>;
