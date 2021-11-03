import {Migration} from "../../models";

export const testMigration: Migration<any, any> = {
    migrationId: 1,
    position: 1,
    execute$: migrate => Promise.resolve(),
    label: ""
};