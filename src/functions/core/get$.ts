import {EntityTypeMap} from "entity-store";
import * as _ from "lodash";
import {CompositeEntityQuery, CompositeEntityQueryResult} from "../../models";

export async function get$<TEntityTypeMap extends EntityTypeMap, TMappingResult>(
    dbConnection: PouchDB.Database,
    selection: CompositeEntityQuery<TEntityTypeMap>,
    map?: (queryResult: CompositeEntityQueryResult<TEntityTypeMap>) => TMappingResult
): Promise<CompositeEntityQueryResult<TEntityTypeMap> | TMappingResult> {

    const result: CompositeEntityQueryResult<TEntityTypeMap> = {};

    const entityTypes = Object.keys(selection);
    const allDocsResult = await dbConnection.allDocs({keys: entityTypes as Array<string>});

    const entityTypeDocs = await dbConnection.bulkGet({
        docs: allDocsResult.rows.map(x => {
            return {id: x.id} as any;
        })
    });

    const entities = _.flatten(entityTypeDocs.results.map(x => {
        return x.docs.map(doc => {

            const result: PouchDB.Core.GetMeta & PouchDB.Core.IdMeta = (doc as any).ok;
            delete result._attachments;
            delete result._rev;
            delete result._conflicts;
            delete result._revs_info;
            return result as any;
        });

    }));

    entityTypes.forEach(entityType => {
        const entityState = entities.find(x => x._id === entityType) as any;
        if (selection[entityType] === "all") {
            (result as any)[entityType] = entityState.entities
        } else {
            (result as any)[entityType] = (selection[entityType] as Array<string>)
                .reduce((previousValue, currentValue) => {
                    previousValue[currentValue] = entityState.entities[currentValue];
                    return previousValue;
                }, {});
        }
    });

    if (map !== undefined && map !== null) {
        return Promise.resolve<TMappingResult>(map(result));
    } else {
        return Promise.resolve<CompositeEntityQueryResult<TEntityTypeMap>>(result);
    }

}
