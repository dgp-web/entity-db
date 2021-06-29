import { Many } from "data-modeling";

export type EntityQuery<TEntity> = "all" | Many<string>;
