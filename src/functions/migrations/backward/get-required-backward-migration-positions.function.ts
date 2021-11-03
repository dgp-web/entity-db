import {Many} from "data-modeling";
import {getNextBackwardMigrationPosition} from "./get-next-backward-migration-position.function";

export function getRequiredBackwardMigrationPositions(payload: {
    readonly currentPosition: number;
    readonly targetPosition: number;
}): Many<number> {

    const currentPosition = payload.currentPosition;
    const targetPosition = payload.targetPosition;

    const length = currentPosition - targetPosition;

    return Array.from({length}, (_, i) => getNextBackwardMigrationPosition({
        i, currentPosition
    }));

}