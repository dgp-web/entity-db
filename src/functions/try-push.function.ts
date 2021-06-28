export function tryPush<T>(collection: Array<T>, item: T): void {
    if (!collection.includes(item)) collection.push(item);
}
