export function getNextForwardMigrationPosition(payload: {
    readonly i: number;
    readonly currentPosition: number;
}): number {
    const i = payload.i;
    const currentPosition = payload.currentPosition;
    return i + 1 + currentPosition;
}