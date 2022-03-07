import {EntityTypeMap} from "data-modeling";
import {CompositeEntityActionPayload} from "entity-store/src/models";
import {CompositeEntityQuery} from "./composite-entity-query.model";
import {CompositeEntityQueryResult} from "./composite-entity-query-result.model";

export interface CRUDEntityDb<TEntityTypeMap extends EntityTypeMap> {
    dispatch$(action: CompositeEntityActionPayload<TEntityTypeMap, null>): Promise<void>;

    get$(selection: CompositeEntityQuery<TEntityTypeMap>): Promise<CompositeEntityQueryResult<TEntityTypeMap>>;

    get$<TMappingResult>(selection: CompositeEntityQuery<TEntityTypeMap>,
                         map?: (queryResult: CompositeEntityQueryResult<TEntityTypeMap>) => TMappingResult): Promise<TMappingResult>;

    close$(): Promise<void>;
}
