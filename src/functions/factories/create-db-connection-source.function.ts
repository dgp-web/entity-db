import { DbConnectionInfo, DbConnectionSource } from "../../models";
import { BehaviorSubject } from "rxjs";

export function createDbConnectionSource(): DbConnectionSource {
    return new BehaviorSubject<DbConnectionInfo>(null);
}
