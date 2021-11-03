import {Many} from "data-modeling";
import {MigrationInfo} from "../../models";
import * as _ from "lodash";
import {toPosition} from "../util/to-position.function";

export function getCurrentMaxMigrationPosition(payload: {
    readonly migrationInfos: Many<MigrationInfo>;
}): number {
    const migrationInfos = payload.migrationInfos;
    return migrationInfos.length > 0 ? _.max(migrationInfos.map(toPosition)) : 0;
}

