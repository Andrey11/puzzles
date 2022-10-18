import { useEffect, useRef } from 'react';

function useAddEventListener(
  eventName: string,
  eventListener: (event: Event) => void,
  targetElement = window
) {
  const savedEventCallback = useRef<(event: Event) => void>();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedEventCallback.current = eventListener;
  }, [eventListener]);

  useEffect(() => {
    // Make sure element supports addEventListener
    // On
    const isSupported = targetElement && targetElement.addEventListener;
    if (!isSupported) return;
    // Create event listener that calls handler function stored in ref
    const eventHandler = (event: Event) =>
      savedEventCallback.current && savedEventCallback.current(event);
    targetElement.addEventListener(eventName, (event) => eventHandler(event), false);

    return () => {
      targetElement.removeEventListener(eventName, (event) => eventHandler(event), false);
    };
  }, [eventName, targetElement]); // Re-run if eventName or element changes
}

export { useAddEventListener as default };
