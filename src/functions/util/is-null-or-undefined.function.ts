export function isNullOrUndefined(value: any, ...additionalValues: any): boolean {
    return value === null
        || value === undefined
        || additionalValues.some(x => x === null || x === undefined);
}