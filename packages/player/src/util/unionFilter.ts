type Type = string | number | symbol | boolean | undefined | null;

/** Filters types union `T` and return a new union of types matching given `type`. */
export type FilteredByType<T extends { type: Type }, type = T["type"]> = type extends T["type"]
  ? Exclude<{ [K in keyof T]: K extends "type" ? type : T[K] }, { type: never }>
  : never;

/** Filter items from list who's "type" property matches `types` and adjust return union type to match it. */
export function typeFilter<i extends { type: Type }[], const k extends i[number]["type"]>(input: i, ...types: k[]): FilteredByType<i[number], k>[] {
  return input.filter((i) => {
    for (const type of types) {
      if (type === i.type) return true;
    }
    return false;
  }) as FilteredByType<i[number], k>[];
}

/** Find the the first item from list who's "type" property matches `types` and adjust return union type to match it. */
export function typeFind<i extends { type: Type }[], const k extends i[number]["type"]>(input: i, ...types: k[]): FilteredByType<i[number], k> | undefined {
  return input.find((i) => {
    for (const type of types) {
      if (type === i.type) return true;
    }
    return false;
  }) as FilteredByType<i[number], k> | undefined;
}
