import {WithMigrations} from "../../models";
import * as _ from "lodash";
import {toPosition} from "../util/to-position.function";

export function getMaxMigrationPosition(payload: WithMigrations) {
    const migrations = payload.migrations;
    return migrations.length > 0 ? _.max(migrations.map(toPosition)) : 0;
}