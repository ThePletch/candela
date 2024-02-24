import _ from 'lodash';

export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}` ?
  `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}` :
  S

export type KeysToSnakeCase<T> = {
[K in keyof T as CamelToSnakeCase<string & K>]: T[K]
}

export function camelToSnakeCase<S extends string>(str: S): CamelToSnakeCase<S> {
  return _.snakeCase(str) as CamelToSnakeCase<S>;
}

export function keysToSnakeCase<T extends Record<string, unknown>>(obj: T): KeysToSnakeCase<T> {
  return _.transform(obj, (newObj, val, key) => ({
    ...newObj,
    [camelToSnakeCase(key)]: val,
  }), {} as KeysToSnakeCase<T>) as KeysToSnakeCase<T>;
}
