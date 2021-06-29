import { ScheduledRequest } from "../../models";

export const testRequest: ScheduledRequest = {
    request$: dbc => Promise.resolve(),
    publishResult: payload => {
    },
    publishError: payload => {
    }
};
