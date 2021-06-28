import {Observable, timer} from "rxjs";
import {ofNull} from "./of-null.function";

export function tryCreateTimer$(delay: number): Observable<number> {
    if (delay === null) return ofNull();
    return timer(delay);
}