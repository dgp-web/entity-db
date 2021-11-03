// tslint:disable-next-line:ban-types
export type FirstArg<T extends Function> = T extends (payload: infer U) => any ? U : never;
