import { MigrationInfo } from "./migration-info.model";
import { MigrationTask } from "./migration-task.model";
import { EntityTypeMap } from "data-modeling";

export interface Migration<TInitialState extends EntityTypeMap, TTargetState extends EntityTypeMap> extends MigrationInfo {
    readonly execute$: MigrationTask<TInitialState, TTargetState>;
}
