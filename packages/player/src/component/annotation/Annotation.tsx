import { FunctionComponent } from "preact";
import { useCallback, useMemo } from "preact/hooks";

import { CardAnnotation } from "@player/component/annotation/CardAnnotation";
import { ExternalContentAnnotation } from "@player/component/annotation/ExternalContentAnnotation";
import { AnnotationConfig } from "@player/model";

/** Annotation component props */
export type AnnotationProps = {
  config: AnnotationConfig;

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
      {props.config.type === "card" && <CardAnnotation config={props.config} />}

      {/* ----- externalcontent ----- */}
      {props.config.type === "externalcontent" && <ExternalContentAnnotation config={props.config} onClose={props.onClose} />}

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
