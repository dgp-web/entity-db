import {Many} from "data-modeling";
import {getNextForwardMigrationPosition} from "./get-next-forward-migration-position.function";

export function getRequiredForwardMigrationPositions(payload: {
    readonly currentPosition: number;
    readonly targetPosition: number;
}): Many<number> {

    const currentPosition = payload.currentPosition;
    const targetPosition = payload.targetPosition;

    const length = targetPosition - currentPosition;

    return Array.from({length}, (_, i) => getNextForwardMigrationPosition({
        i, currentPosition
    }));

}