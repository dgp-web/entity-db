import { EntityTypeMap, Mutable } from "data-modeling";
import { ChangesPublishConfig, CRUDEntityDb, EntityDbAction } from "../../models";
import {
    AddEntityActionParamsMap,
    RemoveEntityActionParamsMap,
    SelectEntityActionParamsMap,
    SetEntityActionParamsMap,
    UpdateEntityActionParamsMap
} from "entity-store/src/models";
import { byDbChangesPublishConfig } from "./by-db-changes-publish-config.function";
import { isNullOrUndefined } from "../util/is-null-or-undefined.function";

export async function filterActionByChangesPublishConfig$<TEntityTypeMap extends EntityTypeMap>(payload: {
    readonly action: EntityDbAction<TEntityTypeMap>;
    readonly config: ChangesPublishConfig<TEntityTypeMap>;
    /**
     * Service parameter, so we can access data from DB if needed
     */
    readonly dbRef: CRUDEntityDb<TEntityTypeMap>;
}): Promise<EntityDbAction<TEntityTypeMap>> {
    const config = payload.config;
    const dbRef = payload.dbRef;

    let action = payload.action;


    if (action.add) {
        const addPayload = action.add as AddEntityActionParamsMap<TEntityTypeMap, any>;

        action = {
            ...action,
            add: Object.keys(addPayload)
                .filter(byDbChangesPublishConfig(config))
                .reduce((result, entityKey) => {

                    const maskingRule = config.maskingRules[entityKey];
                    if (isNullOrUndefined(maskingRule)) result[entityKey] = addPayload[entityKey];
                    else {
                        result[entityKey] = Object.keys(addPayload[entityKey]).reduce((innerResult, entityId) => {
                            const entity = addPayload[entityKey][entityId];
                            innerResult[entityId] = maskingRule(entity);
                            return innerResult;
                        }, {});
                    }

                    return result;
                }, {})
        };

    }

    if (action.update) {
        const updatePayload = action.update as UpdateEntityActionParamsMap<TEntityTypeMap, any>;
        // noinspection ES6RedundantAwait
        action = await {
            ...action,
            update: await Object.keys(updatePayload)
                .filter(byDbChangesPublishConfig(config))
                .reduce(async (result, entityKey: any) => {
                    const maskingRule = config.maskingRules[entityKey];

                    if (isNullOrUndefined(maskingRule)) result[entityKey] = updatePayload[entityKey];
                    else {
                        // noinspection ES6RedundantAwait
                        result[entityKey] = await Object.keys(updatePayload[entityKey]).reduce(async (innerResult, entityId) => {
                            const entityChanges = updatePayload[entityKey][entityId];

                            const storedEntity = await dbRef.get$(
                                {[entityKey]: [entityId]},
                                queryResult => queryResult[entityKey][entityId]
                            );

                            const entity = {...storedEntity, ...entityChanges};
                            innerResult[entityId] = maskingRule(entity);
                            return innerResult;
                        }, {});
                    }

                    return result;
                }, {})
        };
    }

    if (action.set) {
        const setPayload = action.set as SetEntityActionParamsMap<TEntityTypeMap, any>;

        action = {
            ...action,
            set: Object.keys(setPayload)
                .filter(byDbChangesPublishConfig(config))
                .reduce((result, entityKey) => {

                    const maskingRule = config.maskingRules[entityKey];
                    if (isNullOrUndefined(maskingRule)) result[entityKey] = setPayload[entityKey];
                    else {
                        result[entityKey] = Object.keys(setPayload[entityKey]).reduce((innerResult, entityId) => {
                            const entity = setPayload[entityKey][entityId];
                            innerResult[entityId] = maskingRule(entity);
                            return innerResult;
                        }, {});
                    }

                    return result;
                }, {})
        };
    }

    if (action.remove) {
        const removePayload = action.remove as Mutable<RemoveEntityActionParamsMap<TEntityTypeMap, any>>;
        action = {
            ...action,
            remove: Object.keys(removePayload)
                .filter(byDbChangesPublishConfig(config))
                .reduce((result, key) => {
                    result[key] = removePayload[key];
                    return result;
                }, {})
        };
    }

    if (action.select) {
        const selectPayload = action.select as Mutable<SelectEntityActionParamsMap<TEntityTypeMap, any>>;
        action = {
            ...action,
            select: Object.keys(selectPayload)
                .filter(byDbChangesPublishConfig(config))
                .reduce((result, key) => {
                    result[key] = selectPayload[key];
                    return result;
                }, {})
        };
    }


    return action;
}