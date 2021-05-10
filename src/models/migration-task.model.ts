import { EntityDb } from "./entity-db.model";
import { EntityTypeMap } from "entity-store";

export type MigrationTask<TInitialState extends EntityTypeMap, TTargetState extends EntityTypeMap> = (migrate: {
    readonly from: EntityDb<TInitialState>;
    readonly to: EntityDb<TTargetState>
}) => Promise<void>;
