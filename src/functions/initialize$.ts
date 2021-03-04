import {createEntityState} from "entity-store";

export async function initialize$(dbConnection: PouchDB.Database,
                                  entityTypes: Array<string>): Promise<void> {
    const result = await dbConnection.allDocs({keys: entityTypes as Array<string>});
    const foundKeys = result.rows.map(x => x.id);

    const entityTypesToCreate = entityTypes.filter(
        entityType => !foundKeys.includes(entityType as string)
    );
    const bulkActions: Array<PouchDB.Core.PostDocument<any>> = entityTypesToCreate.map(entityType => {
        return {
            _id: entityType,
            ...createEntityState()
        } as PouchDB.Core.PostDocument<any>;
    });

    await dbConnection.bulkDocs(bulkActions);
}
