import { FunctionComponent, h } from "preact";
import { useEffect, useRef } from "preact/hooks";

import { AnnotationConfig, DataEvent, RouteEvent, TypedUnion } from "@player/model";

/** External content annotation component props */
export interface ExternalContentAnnotationProps {
  config: TypedUnion<AnnotationConfig, "externalcontent">;

  onData?: (data: DataEvent) => void;
  onRoute?: (route: RouteEvent) => void;
  onClose?: () => void;
}

/** External content annotation component */
const ExternalContentAnnotation: FunctionComponent<ExternalContentAnnotationProps> = (props) => {
  const config = props.config.externalcontent;

  const containerRef = useRef<HTMLDivElement>(null);
  const externalContentRef = useRef<Element | null>(null);
  const externalContentParentRef = useRef<Element | null>(null);

  useEffect(() => {
    const el = document.querySelector(config.selector);
    const parentEl = el?.parentElement;

    if (el != null && parentEl != null) {
      // --- store content el and it's original parent
      externalContentRef.current = el;
      externalContentParentRef.current = el.parentElement;

      // detach element
      el?.parentElement?.removeChild(el);

      containerRef.current?.appendChild(el);
    } else {
      console.warn(`Empty external el or it's parent`, el, parentEl);
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

  return <div className="vaply-externalContentAnnotation__container" ref={containerRef} />;
};

export { ExternalContentAnnotation };
