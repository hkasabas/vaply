import { useEffect } from "preact/hooks";

import { useFirstMountState } from "@player/util/hook/useFirstMountState";

/**
 * Use React `useEffect` but skip the first render and execute only on updates.
 *
 * This effect can be used for example to skip call blur or change event on
 * first render but only on value updates.
 */
const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
