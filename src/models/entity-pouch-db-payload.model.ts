import { MigrationEntities } from "./migration-entities.model";
import { Many } from "data-modeling";
import { Migration } from "./migration.model";
import { PouchDbRef } from "./pouch-db-ref.model";

export interface EntityPouchDbPayload<TEntityTypeMap extends MigrationEntities> {
    readonly entityTypes: Many<keyof TEntityTypeMap>,
    readonly dbRef: PouchDbRef,
    readonly migrations?: Many<Migration<any, any>>
}
