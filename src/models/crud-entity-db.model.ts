import { EntityTypeMap } from "data-modeling";
import { CompositeEntityQuery } from "./composite-entity-query.model";
import { CompositeEntityQueryResult } from "./composite-entity-query-result.model";
import { EntityDbAction } from "./entity-db-action.model";

export interface CRUDEntityDb<TEntityTypeMap extends EntityTypeMap> {
    dispatch$(action: EntityDbAction<TEntityTypeMap>): Promise<void>;

    get$(selection: CompositeEntityQuery<TEntityTypeMap>): Promise<CompositeEntityQueryResult<TEntityTypeMap>>;

    get$<TMappingResult>(selection: CompositeEntityQuery<TEntityTypeMap>,
                         map?: (queryResult: CompositeEntityQueryResult<TEntityTypeMap>) => TMappingResult): Promise<TMappingResult>;

    close$(): Promise<void>;
}
