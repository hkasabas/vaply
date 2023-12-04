import { FunctionComponent } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

import { useDomEvent } from "@player/component/hook/useDomEvent";
import { AnnotationConfig, RouteEvent } from "@player/model";
import { FilteredByType } from "@player/util/unionFilter";

/** External content annotation component props */
export interface ExternalContentAnnotationProps {
  config: FilteredByType<AnnotationConfig, "externalcontent">;

  onRoute?: (route: RouteEvent) => void;
  onClose?: () => void;
}

/** External content annotation component */
const ExternalContentAnnotation: FunctionComponent<ExternalContentAnnotationProps> = (props) => {
  const config = props.config.externalcontent;

  const containerRef = useRef<HTMLDivElement>(null);
  const externalContentRef = useRef<HTMLElement | null>(null);
  const externalContentParentRef = useRef<HTMLElement | null>(null);

  // not using layout effect here since this entire component is removed from DOM on unmount
  // so it looks unnecessary to return ext. content el to it's parent synchronously (what layout effect does)
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(config.selector);
    const parentEl = el?.parentElement;

    if (el != null && parentEl != null) {
      // --- store content el and it's original parent
      externalContentRef.current = el;
      externalContentParentRef.current = el.parentElement;

      // detach element
      el?.parentElement?.removeChild(el);

      containerRef.current?.appendChild(el);
    } else if (el == null) {
      console.warn(`Empty external content annotation's el: "${config.selector}"`);
    } else if (parentEl == null) {
      console.warn(`Empty external content annotation el's parent`);
    }

    return () => {
      if (externalContentRef.current && externalContentParentRef.current) {
        // reattach element to it's original parent
        externalContentParentRef.current.appendChild(externalContentRef.current);
      }

      externalContentRef.current = null;
      externalContentParentRef.current = null;
    };
  }, [config.selector]);

  // --- handle close event
  const handleClose = useCallback(() => {
    props.onClose?.();
  }, [props.onClose]);
  useDomEvent(externalContentRef, "click", handleClose);

  return <div className="vaply-externalContentAnnotation__container" ref={containerRef} />;
};

export { ExternalContentAnnotation };
