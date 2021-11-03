import {Many} from "data-modeling";
import {MigrationInfo} from "../../models";
import * as _ from "lodash";

export function getCurrentMaxMigrationPosition(payload: {
    readonly migrationInfos: Many<MigrationInfo>;
}): number {
    const migrationInfos = payload.migrationInfos;
    return migrationInfos.length > 0 ? _.max(migrationInfos.map(x => x.position)) : 0;
}

