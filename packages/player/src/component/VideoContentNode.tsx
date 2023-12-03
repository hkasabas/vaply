import { FunctionComponent, JSX } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

import { ObjectValue, VideoContentConfig } from "@player/model";
import useUpdateEffect from "@player/util/hook/useUpdateEffect";
import { NODE_ROUTE_NEXT_NODE, NODE_ROUTE_NODE_END, NODE_ROUTE_NODE_START, NODE_ROUTE_PREVIOUS_NODE } from "@player/util/router";

/**
 * Video content node component props.
 */
export type CommonContentNodeProps<T> = {
  config: T;
  currentPosition?: ObjectValue<string>;
  blocked?: boolean;

  onContentReady?: () => void;
  onContentPlay?: () => void;
  onContentPause?: () => void;
  onContentEnd?: () => void;
  onContentTimeUpdate?: (time: number) => void;
};

export type VideoContentNodeProps = CommonContentNodeProps<VideoContentConfig>;

/**
 * Video content node component
 *
 * Renders actual HTML video element, listens to it's events and sends them to content node.
 * It also updates video's current time on external navigation.
 */
const VideoContentNode: FunctionComponent<VideoContentNodeProps> = (props) => {
  const videElRef = useRef<HTMLVideoElement>(null);

  // ---------- props changes

  useUpdateEffect(() => {
    videElRef.current?.play();
  }, [props.config]);

  // blocked content
  useEffect(() => {
    if (videElRef.current != null) {
      if (props.blocked) {
        videElRef.current.pause();
      } else if (videElRef.current.paused && videElRef.current.currentTime !== 0) {
        videElRef.current.play();
      }
    }
  }, [props.blocked, videElRef]);

  // route change
  useEffect(() => {
    if (videElRef.current != null && props.currentPosition?.value != null) {
      let newPosition;
      if (props.currentPosition.value == NODE_ROUTE_NODE_START) {
        newPosition = 0;
      } else if (props.currentPosition.value == NODE_ROUTE_NODE_END) {
        newPosition = videElRef.current.duration;
      } else if (props.currentPosition.value == NODE_ROUTE_PREVIOUS_NODE || props.currentPosition.value == NODE_ROUTE_NEXT_NODE) {
        newPosition = 0;
      } else {
        newPosition = Number.parseInt(props.currentPosition.value, 10);
      }

      console.log("newPosition", newPosition);
      videElRef.current.currentTime = newPosition;
    }
  }, [props.currentPosition]);

  // ---------- event handlers

  const handleCanPlay = useCallback(() => {
    props.onContentReady?.();
  }, [props.onContentReady]);

  const handlePlay = useCallback(() => {
    props.onContentPlay?.();
  }, [props.onContentPlay]);

  const handlePause = useCallback(() => {
    props.onContentPause?.();
  }, [props.onContentPause]);

  const handleEnded = useCallback(() => {
    props.onContentEnd?.();
  }, [props.onContentEnd]);

  const handleTimeUpdate = useCallback(
    (event: JSX.TargetedEvent<HTMLVideoElement>) => {
      props.onContentTimeUpdate?.(event.currentTarget.currentTime);
    },
    [props.onContentTimeUpdate]
  );

  const handleSeeked = useCallback(
    (event: JSX.TargetedEvent<HTMLVideoElement>) => {
      props.onContentTimeUpdate?.(event.currentTarget.currentTime);
    },
    [props.onContentTimeUpdate]
  );

  return (
    <div className="vaply-videoContentNode--contentContainer">
      {/* ----- file video ----- */}
      {props.config.file && (
        <video
          poster={props.config.file.poster}
          src={props.config.file.src}
          ref={videElRef}
          controls
          preload="metadata"
          loading="lazy"
          onCanPlay={handleCanPlay}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onSeeked={handleSeeked}
        />
      )}
    </div>
  );
};

export { VideoContentNode };
