import { h, FunctionComponent } from "preact";
import { useCallback, useMemo } from "preact/hooks";

import { CardAnnotation } from "@player/component/annotation/CardAnnotation";
import { AnnotationConfig, DataEvent, RouteEvent } from "@player/model";

/** Annotation component props */
export type AnnotationProps = {
  config: AnnotationConfig;

  onData?: (data: DataEvent) => void;
  onRoute?: (route: RouteEvent) => void;
  onClose?: () => void;
};

/**
 * Annotation component
 *
 * Display annotation config using appropriate annotation component
 */
const Annotation: FunctionComponent<AnnotationProps> = (props) => {
  // annotation positioning
  const positionProps = useMemo(() => {
    return {
      top: props.config.position.static?.top,
      right: props.config.position.static?.right,
      bottom: props.config.position.static?.bottom,
      left: props.config.position.static?.left,
      width: props.config.dimensions?.width,
      height: props.config.dimensions?.height,
    };
  }, [props.config.position.static]);

  const handleClose = useCallback(() => {
    props.onClose?.();
  }, [props.onClose]);

  return (
    <div className="vaply-annotation__staticPosition" style={positionProps}>
      {/* ----- card ----- */}
      {props.config.type === "card" && <CardAnnotation config={props.config} onData={props.onData} onRoute={props.onRoute} onClose={props.onClose} />}

      {/* close button */}
      {props.config.dismissible && (
        <div className="vaply-annotation__closeButton" onClick={handleClose}>
          &times;
        </div>
      )}
    </div>
  );
};

export { Annotation };
