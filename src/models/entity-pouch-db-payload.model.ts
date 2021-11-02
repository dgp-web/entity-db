import {MigrationEntities} from "./migration-entities.model";
import {Many} from "data-modeling";
import {Migration} from "./migration.model";
import {PouchDbRef} from "./pouch-db-ref.model";
import {MigrationId} from "./migration-id.model";

export interface EntityPouchDbPayload<TEntityTypeMap extends MigrationEntities> {
    readonly entityTypes: Many<keyof TEntityTypeMap>;
    readonly dbRef: PouchDbRef;
    readonly migrations?: ReadonlyArray<Migration<any, any>>;
    readonly targetMigrationId?: MigrationId;
    readonly disableAutoMigrations?: boolean;
}
