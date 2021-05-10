import { EntityDb, Migration, MigrationEntities } from "../models";
import * as _ from "lodash";
import { AddEntityActionParamsMap } from "entity-store/src/models/composite-entity-action-payload.model";

/**
 * Describes how the database should be setup and migrated to a new level
 */
export async function runMigrations$<TEntities extends MigrationEntities>(payload: {
    readonly db: EntityDb<TEntities>,
    readonly migrations: ReadonlyArray<Migration<any, any>>
}): Promise<void> {

    const db = payload.db;
    const migrations = payload.migrations;

    const result = await db.get$({migrationInfo: "all"});

    let migrationInfos = Object.values(result.migrationInfo);
    migrationInfos = _.sortBy(migrationInfos, x => x.position);
    const maxPosition = migrationInfos.length > 0 ? _.max(migrationInfos.map(x => x.position)) : 0;

    const newMigrations = migrations.filter(migration => migration.position > maxPosition);

    for (const migration of newMigrations) {
        await migration.execute$({from: db, to: db});
        await db.dispatch$({
            add: {
                migrationInfo: {
                    [migration.migrationId]: {
                        migrationId: migration.migrationId,
                        label: migration.label,
                        position: migration.position,
                        description: migration.description
                    }
                }
            } as AddEntityActionParamsMap<TEntities, null>
        });
    }
}
