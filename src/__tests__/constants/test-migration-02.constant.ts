import {Migration} from "../../models";

export const testMigration02: Migration<any, any> = {
    migrationId: 2,
    position: 2,
    execute$: migrate => Promise.resolve(),
    label: ""
};