import { BehaviorSubject } from "rxjs";
import { DbConnectionInfo } from "./db-connection-info.model";

export type DbConnectionSource = BehaviorSubject<DbConnectionInfo>;
