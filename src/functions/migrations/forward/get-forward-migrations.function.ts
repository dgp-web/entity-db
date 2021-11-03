import {Migration, WithMigrations} from "../../../models";
import * as _ from "lodash";

export function getForwardMigrations(payload: {
    readonly currentPosition: number;
    readonly targetPosition: number;
} & WithMigrations): ReadonlyArray<Migration<any, any>> {

    const migrations = payload.migrations;
    const targetPosition = payload.targetPosition;
    const currentPosition = payload.currentPosition;

    let forwardMigrations = migrations.filter(migration => migration.position > currentPosition && migration.position <= targetPosition);
    forwardMigrations = _.sortBy(forwardMigrations, x => x.position);
    return forwardMigrations;

}