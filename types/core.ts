/** biome-ignore-all lint/suspicious/noExplicitAny: Allow any type for function arguments and return values */
export type AnyFunction = (...args: any[]) => any | Promise<any>;
