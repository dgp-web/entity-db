export function getNextBackwardMigrationPosition(payload: {
    readonly i: number;
    readonly currentPosition: number;
}): number {
    const i = payload.i;
    const currentPosition = payload.currentPosition;
    return currentPosition - i;
}