import { CloseDbTimer } from "./close-db-timer.model";

export interface WithCloseDbTimer {
    readonly closeDbTimer$: CloseDbTimer;
}
