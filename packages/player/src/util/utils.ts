/** Function that ensures exhaustivness of conditional statements. */
export function assertUnreachable(value: never): never {
  throw new UnreachableError(`Unexpected value: "${value}"`);
}

export class UnreachableError extends Error {
  constructor(message: string) {
    super(`Unreachable code path. ${message}`);
  }
}
