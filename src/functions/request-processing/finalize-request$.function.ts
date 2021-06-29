import { CloseDbTimer } from "../../models";
import { entityPouchDbConfig } from "../../constants";

export interface FinalizeRequest$ {
    readonly closeDbTimer$: CloseDbTimer;
}

export function finalizeRequest$(
    payload: FinalizeRequest$,
    config = entityPouchDbConfig
): Promise<void> {
    const closeDbTimer$ = payload.closeDbTimer$;
    closeDbTimer$.next(config.keepIdleConnectionAlivePeriod);
    return Promise.resolve();
}
