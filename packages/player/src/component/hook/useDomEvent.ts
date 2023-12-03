import { useEffect, useRef } from "preact/hooks";

type EventType = keyof GlobalEventHandlersEventMap;

/** Hook that handles sub/unsubscribing from DOM events. */
function useDomEvent<T extends EventTarget>(
  element: T | null,
  eventType: EventType,
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
) {
  // Ref to store the handler
  const savedHandler = useRef<(event: Event) => void>();

  // Update ref.current value if handler changes.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (element == null) return;

    // Create event listener that calls handler function stored in ref
    const eventListener: typeof handler = (event) => savedHandler.current?.(event);

    // Add event listener
    element.addEventListener(eventType, eventListener, options);

    // Remove event listener on cleanup
    return () => {
      element.removeEventListener(eventType, eventListener, options);
    };
  }, [eventType, element, options]); // Re-run if eventType, element, or options change

  // Once function
  const once = (onceHandler: (event: Event) => void) => {
    const wrappedHandler = (event: Event) => {
      onceHandler(event);
      element?.removeEventListener(eventType, wrappedHandler, options);
    };
    element?.addEventListener(eventType, wrappedHandler, options);
  };

  return { once };
}

export default useDomEvent;
