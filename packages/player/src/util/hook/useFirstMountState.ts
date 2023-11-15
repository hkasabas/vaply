import { useRef } from "preact/hooks";

/**
 * Returns a value that states if current render is the first.
 */
export function useFirstMountState(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}
