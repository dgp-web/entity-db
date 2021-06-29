export type ObjectOrFactory<T extends object> = (() => T) | T;
