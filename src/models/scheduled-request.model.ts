export interface ScheduledRequest {
    readonly request$: (dbConnection: PouchDB.Database) => Promise<any>;
    readonly publishResult: (payload?: any) => void;
    readonly publishError: (payload?: any) => void;
}
