import { RequestScheduler } from "./request-scheduler.model";

export interface WithRequestScheduler {
    readonly requestScheduler$: RequestScheduler;
}
