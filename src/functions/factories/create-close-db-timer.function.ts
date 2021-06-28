import { CloseDbTimer } from "../../models";
import { Subject } from "rxjs";

export function createCloseDbTimer(): CloseDbTimer {
    return new Subject<number>();
}
