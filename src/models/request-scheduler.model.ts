import { Subject } from "rxjs";
import { ScheduledRequest } from "./scheduled-request.model";

export type RequestScheduler = Subject<ScheduledRequest>;
