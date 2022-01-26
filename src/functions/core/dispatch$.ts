import {createEntityState, EntityTypeMap, KVS} from "entity-store";
import {
    AddEntityActionParamsMap,
    ClearEntityActionParamsList,
    CompositeEntityActionPayload,
    RemoveEntityActionParamsMap,
    SelectEntityActionParamsMap,
    SetEntityActionParamsMap,
    UpdateEntityActionParamsMap
} from "entity-store/src/models";
import {
    addEntitiesToState,
    removeEntitiesFromState,
    selectEntitiesInState,
    setEntitiesInState,
    updateEntitiesInState
} from "entity-store/src/functions";
import * as _ from "lodash";

export async function dispatch$<TEntityTypeMap extends EntityTypeMap>(
    dbConnection: PouchDB.Database,
    action: CompositeEntityActionPayload<TEntityTypeMap, null>
): Promise<void> {


    // Map of entityKey to PutDocument
    const entityTypeBulkUpdateMap: KVS<PouchDB.Core.PutDocument<any>> = {};

    // -----
    let result1;
    let entity;
    
    // Clear
    if (action.clear) {
        const entityTypesToClear = action.clear as ClearEntityActionParamsList<TEntityTypeMap, any>;
        result1 = await dbConnection.bulkGet({
            docs: entityTypesToClear.map(x => {
                return {id: x} as any;
            })
        });
        entityTypesToClear.forEach(entityType => {
            const currentState = entity.find(x => x._id === entityType) as any;
            entityTypeBulkUpdateMap[entityType as string] = {...currentState, ...createEntityState()};
        });
    }

    // Remove
    if (action.remove) {

        const entityTypesToRemoveKeysMap = action.remove as RemoveEntityActionParamsMap<TEntityTypeMap, any>;
        const entityTypesFromWhichToRemoveKeys = Object.keys(entityTypesToRemoveKeysMap);
        result1 = await dbConnection.bulkGet({
            docs: entityTypesFromWhichToRemoveKeys.map(x => {
                return {id: x} as any;
            })
        });
        entity = _.flatten(result1.results
            .map(x => {
                return x.docs.map(doc => {

                    const result: PouchDB.Core.GetMeta & PouchDB.Core.IdMeta = (doc as any).ok;
                    return result as any;
                });

            }));
        entityTypesFromWhichToRemoveKeys.map(async entityType => {
            const idsToRemove = entityTypesToRemoveKeysMap[entityType];
            const currentState = entity.find(x => x._id === entityType) as any;
            entityTypeBulkUpdateMap[entityType] = removeEntitiesFromState(currentState as any, idsToRemove);
        });
    }

    // Set
    if (action.set) {

        const entityTypesToSetKeysMap = action.set as SetEntityActionParamsMap<TEntityTypeMap, any>;
        const entityTypesFromWhichToSetKeys = Object.keys(entityTypesToSetKeysMap);
        result1 = await dbConnection.bulkGet({
            docs: entityTypesFromWhichToSetKeys.map(x => {
                return {id: x} as any;
            })
        });
        entity = _.flatten(result1.results
            .map(x => {
                return x.docs.map(doc => {

                    const result: PouchDB.Core.GetMeta & PouchDB.Core.IdMeta = (doc as any).ok;
                    return result as any;
                });

            }));
        entityTypesFromWhichToSetKeys.map(entityType => {
            const entityToSetKVS = entityTypesToSetKeysMap[entityType];
            const currentState = entity.find(x => x._id === entityType) as any;
            entityTypeBulkUpdateMap[entityType] = setEntitiesInState(currentState as any, entityToSetKVS);
        });
    }

    // Add
    if (action.add) {

        const entityTypesToAddKeysMap = action.add as AddEntityActionParamsMap<TEntityTypeMap, any>;
        const entityTypesFromWhichToAddKeys = Object.keys(entityTypesToAddKeysMap);
        result1 = await dbConnection.bulkGet({
            docs: entityTypesFromWhichToAddKeys.map(x => {
                return {id: x} as any;
            })
        });
        entity = _.flatten(result1.results
            .map(x => {
                return x.docs.map(doc => {

                    const result: PouchDB.Core.GetMeta & PouchDB.Core.IdMeta = (doc as any).ok;
                    return result as any;
                });

            }));
        entityTypesFromWhichToAddKeys.map(entityType => {
            const entityToAddKVS = entityTypesToAddKeysMap[entityType];
            const currentState = entity.find(x => x._id === entityType) as any;
            entityTypeBulkUpdateMap[entityType] = addEntitiesToState(currentState as any, entityToAddKVS);
        });
    }

    // Update
    if (action.update) {

        const entityTypesToUpdateKeysMap = action.update as UpdateEntityActionParamsMap<TEntityTypeMap, any>;
        const entityTypesFromWhichToUpdateKeys = Object.keys(entityTypesToUpdateKeysMap);
        result1 = await dbConnection.bulkGet({
            docs: entityTypesFromWhichToUpdateKeys.map(x => {
                return {id: x} as any;
            })
        });
        entity = _.flatten(result1.results
            .map(x => {
                return x.docs.map(doc => {

                    const result: PouchDB.Core.GetMeta & PouchDB.Core.IdMeta = (doc as any).ok;
                    return result as any;
                });

            }));
        entityTypesFromWhichToUpdateKeys.map(entityType => {
            const entityToUpdateKVS = entityTypesToUpdateKeysMap[entityType];
            const currentState = entity.find(x => x._id === entityType) as any;
            entityTypeBulkUpdateMap[entityType] = updateEntitiesInState(currentState as any, entityToUpdateKVS);
        });
    }

    // Select
    if (action.select) {
        const entityTypesToSelectKeysMap = action.select as SelectEntityActionParamsMap<TEntityTypeMap, any>;
        const entityTypesFromWhichToSelectKeys = Object.keys(entityTypesToSelectKeysMap);
        result1 = await dbConnection.bulkGet({
            docs: entityTypesFromWhichToSelectKeys.map(x => {
                return {id: x} as any;
            })
        });
        entity = _.flatten(result1.results
            .map(x => {
                return x.docs.map(doc => {

                    const result: PouchDB.Core.GetMeta & PouchDB.Core.IdMeta = (doc as any).ok;
                    return result as any;
                });

            }));
        entityTypesFromWhichToSelectKeys.map(entityType => {
            const entityToSelect = entityTypesToSelectKeysMap[entityType];
            const currentState = entity.find(x => x._id === entityType) as any;
            entityTypeBulkUpdateMap[entityType] = selectEntitiesInState(currentState as any, entityToSelect);
        });
    }
    // -----

    const bulkUpdateItems = Object.keys(entityTypeBulkUpdateMap).map(entityType => {
        return entityTypeBulkUpdateMap[entityType] as PouchDB.Core.PutDocument<any>;
    })
    return dbConnection.bulkDocs(bulkUpdateItems).then();

}
