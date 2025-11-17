export type FieldPresenceFlags<K> = {
  [Property in keyof K as `has${Capitalize<string & Property>}`]-?: boolean;
};

export type SelectForType<T extends Record<string, unknown>, X> = {
  [K in keyof T as T[K] extends X ? K : never]: T[K];
};

export type KeysWithValuesOfType<
  T extends Record<string, unknown>,
  X,
> = keyof SelectForType<T, X>;
