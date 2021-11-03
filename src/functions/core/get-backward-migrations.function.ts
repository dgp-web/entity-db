import {Migration, WithMigrations} from "../../models";
import * as _ from "lodash";

export function getBackwardMigrations(payload: {
    readonly currentPosition: number;
    readonly targetPosition: number;
} & WithMigrations): ReadonlyArray<Migration<any, any>> {

    const migrations = payload.migrations;
    const targetPosition = payload.targetPosition;
    const currentPosition = payload.currentPosition;

    let backwardMigrations = migrations.filter(migration => migration.position >= targetPosition && migration.position < currentPosition);
    backwardMigrations = _.sortBy(backwardMigrations, x => x.position).reverse();
    return backwardMigrations;

}