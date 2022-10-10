export type FieldPresenceFlags<K> = {
  [Property in keyof K as `has${Capitalize<string & Property>}`]-?: boolean;
};
