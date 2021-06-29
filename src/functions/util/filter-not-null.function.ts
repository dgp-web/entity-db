import {filter} from "rxjs/operators";

export function filterNotNull<T>() {
    return filter<T>(x => x !== null);
}