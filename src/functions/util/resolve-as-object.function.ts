import { ObjectOrFactory } from "../../models";

export function resolveAsObject<T extends object>(payload: ObjectOrFactory<T>): T {
    if (typeof payload === "object") return payload as T;
    else if (typeof payload === "function") return payload();
    console.log(typeof payload);
}
