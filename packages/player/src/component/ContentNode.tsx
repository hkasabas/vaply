import classNames from "classnames";
import { FunctionComponent } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";

import { VideoContentNode } from "@player/component/VideoContentNode";
import { Annotation } from "@player/component/annotation/Annotation";
import { ContentNodeConfig, RouteEvent, AnnotationConfig, AnnotationTriggerConfig, ObjectValue } from "@player/model";
import {
  findActiveAnnotations,
  findApplicableAnnotations as findAvailableAnnotations,
  findTriggerStart,
  hasBlockingAnnotations,
} from "@player/util/annotation";
import { getAnnotatedPosition, isAnnotatedPosition, NodeRoute, NODE_ROUTE_NEXT_NODE } from "@player/util/router";

/** Content node component props */
export type ContentNodeProps = {
  config: ContentNodeConfig;
  annotations: AnnotationConfig[];
  triggers: AnnotationTriggerConfig[];
  route?: NodeRoute;

  onRoute?: (route: RouteEvent) => void;
};

/**
 * Content node component
 *
 * Component in charge of all internal management inside a single node like
 * content starting, stopping, showing annotations, ...
 */
const ContentNode: FunctionComponent<ContentNodeProps> = (props) => {
  // track current time
  const [currentTime, setCurrentTime] = useState<number>(0);
  // track closed annotations
  const [closedAnnotations, setClosedAnnotations] = useState<AnnotationConfig[]>([]);

  // annotations available at the current moment
  const availableAnnotations = useMemo(() => {
    return findAvailableAnnotations(currentTime.toString(), "timeupdate", props.annotations, props.triggers);
  }, [currentTime]);

  // update resulting annotations
  const activeAnnotations = useMemo(() => {
    return findActiveAnnotations(availableAnnotations, closedAnnotations);
  }, [availableAnnotations, closedAnnotations]);

  // is content blocked iow. do we have an active blocking annotation
  const isContentBlocked = useMemo(() => {
    return hasBlockingAnnotations(activeAnnotations);
  }, [activeAnnotations]);

  // memoize CSS classes
  const containerClassNames = useMemo(() => {
    return classNames({
      "vaply-contentNode--contentContainer": true,
      "vaply-contentNode__blockingAnnotationMask": isContentBlocked ?? false,
    });
  }, [isContentBlocked]);

  // translate node route to content position
  const currentPosition: ObjectValue<string> | undefined = useMemo(() => {
    // annotated position
    if (isAnnotatedPosition(props.route?.position)) {
      const annotationName = getAnnotatedPosition(props.route?.position);
      return (
        props.triggers
          // find targeted annotation
          .filter((trigger) => trigger.targetCode === annotationName)
          // take it's start position
          .map((trigger) => ({ value: findTriggerStart(trigger)?.toString() }))
          .shift()
      );
    }
    // return route position as is
    return { value: props.route?.position };
  }, [props.route, props.triggers]);

  // ---------- handle events

  //  content timeupdate
  const handleContentTimeupdate = useCallback(
    (time: number) => {
      setCurrentTime(time);
    },
    [props.annotations, props.triggers]
  );

  // close annotation - Add annotation to closed annot list
  function handleAnnotationClose(targetAnnotation: AnnotationConfig) {
    setClosedAnnotations([
      ...closedAnnotations
        // prevent adding duplicate annotations
        .filter((annot) => annot.code !== targetAnnotation.code),
      targetAnnotation,
    ]);
  }

  // content node end
  const handleContentEnd = useCallback(() => {
    props.onRoute?.(NODE_ROUTE_NEXT_NODE);
  }, [props.onRoute]);

  return (
    <div className={containerClassNames}>
      {/* ---- Video node ---- */}
      {props.config.video && (
        <VideoContentNode
          currentPosition={currentPosition}
          config={props.config.video}
          blocked={isContentBlocked}
          onTimeUpdate={handleContentTimeupdate}
          onEnd={handleContentEnd}
        />
      )}

      {/* ----- Annotations ----- */}
      {activeAnnotations.map((annot) => (
        <Annotation key={annot.code} config={annot} onClose={() => handleAnnotationClose(annot)} />
      ))}
    </div>
  );
};

export { ContentNode };
