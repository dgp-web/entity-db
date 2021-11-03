import {WithMigrations} from "../../models";
import * as _ from "lodash";

export function getMaxMigrationPosition(payload: WithMigrations) {
    const migrations = payload.migrations;
    return migrations.length > 0 ? _.max(migrations.map(x => x.position)) : 0;
}