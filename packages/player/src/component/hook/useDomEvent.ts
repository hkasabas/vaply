import { RefObject } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

/** Hook that subscribes and automatically unsubscribes from DOM events. */
export function useDomEvent<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
  element: RefObject<T>,
  eventType: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  // Ref to store the handler
  const savedHandler = useRef(handler);

  // store handler
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const el = element.current;

    if (el == null) return;

    // create event listener that calls handler function stored in ref
    const eventListener: typeof handler = (event) => savedHandler.current?.(event);

    // add event listener
    el.addEventListener(eventType, eventListener, options);

    return () => {
      // remove event listener on cleanup
      el.removeEventListener(eventType, eventListener, options);
    };
  }, [eventType, element, options]);
}

/** Hook that subscribes to DOM event but automatically unsubscribes after the first event, or unmount. Whichever comes first. */
export function useDomEventOnce<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
  element: RefObject<T>,
  eventType: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) {
  const handlerCalled = useRef<boolean>(false);

  const onceHandler = useCallback<typeof handler>(
    (evt) => {
      if (!handlerCalled.current) {
        handlerCalled.current = true;
        handler(evt);
      }
    },
    [handler]
  );

  useDomEvent(element, eventType, onceHandler, options);
}
