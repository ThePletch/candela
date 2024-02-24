export type FieldPresenceFlags<K> = {
  [Property in keyof K as `has${Capitalize<string & Property>}`]-?: boolean;
};

export type KeysWithValuesOfType<
  T extends Record<string, unknown>,
  X
> = keyof {
  [K in keyof T]: T[K] extends X ? T[K] : never;
};
