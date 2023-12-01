/** Function that ensures exhaustivness of conditional statements. */
export function assertUnreachable(value: never): never {
  throw new UnreachableError(`Unexpected value: "${value}"`);
}

/** Error thrown when and unreachable path is detected. */
export class UnreachableError extends Error {
  constructor(message: string) {
    super(`Unreachable code path. ${message}`);
  }
}

/**
 * Merge two objects recursively.
 *
 * Target object is first cloned to avoid changing the original and a new object is returned
 */
export function merge<T extends PlainObject, C extends Array<PlainObject>>(target: T, ...sources: C) {
  const targetCopy = { ...target };
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      (targetCopy as PlainObject)[key] = isPlainObject(value) && isPlainObject(targetCopy[key]) ? merge(targetCopy[key] as PlainObject, value) : value;
    }
  }
  return targetCopy;
}

export type PlainObject = Record<PropertyKey, unknown>;

/** Detect if value is a plain JS object and return `true` if it is and `false` otherwise. */
export function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== "object" || value === null) return false;

  // objects with "null" prototype is a valid plain object
  if (Object.getPrototypeOf(value) === null) return true;

  // find the base prototype
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  // for plain object it's prototype must be the same
  return Object.getPrototypeOf(value) === proto;
}
