import { FunctionComponent, JSX } from "preact";
import { useCallback, useEffect, useRef } from "preact/hooks";

import { ObjectValue, VideoContentConfig } from "@player/model";
import useUpdateEffect from "@player/util/hook/useUpdateEffect";
import { NODE_ROUTE_NEXT_NODE, NODE_ROUTE_NODE_END, NODE_ROUTE_NODE_START, NODE_ROUTE_PREVIOUS_NODE } from "@player/util/router";

/**
 * Video content node component props.
 */
export type VideoContentNodeProps = {
  config: VideoContentConfig;
  currentPosition?: ObjectValue<string>;
  blocked?: boolean;

  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onTimeUpdate?: (time: number) => void;
};

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
  }, [props.blocked]);

  // route change
  useEffect(() => {
    if (videElRef.current != null && props.currentPosition?.value != null) {
      let newPosition;
      if (props.currentPosition.value == NODE_ROUTE_NODE_START) {
        console.log("props.currentPosition.value", props.currentPosition.value);
        newPosition = 0;
      } else if (props.currentPosition.value == NODE_ROUTE_NODE_END) {
        newPosition = videElRef.current.duration;
      } else if (props.currentPosition.value == NODE_ROUTE_PREVIOUS_NODE || props.currentPosition.value == NODE_ROUTE_NEXT_NODE) {
        newPosition = 0;
      } else {
        newPosition = Number.parseInt(props.currentPosition.value, 10);
      }

      videElRef.current.currentTime = newPosition;
    }
  }, [props.currentPosition]);

  // ---------- event handlers

  const handleCanPlay = useCallback(() => {
    props.onReady?.();
  }, [props.onReady]);

  const handlePlay = useCallback(() => {
    props.onPlay?.();
  }, [props.onPlay]);

  const handlePause = useCallback(() => {
    props.onPause?.();
  }, [props.onPause]);

  const handleEnd = useCallback(() => {
    props.onEnd?.();
  }, [props.onEnd]);

  const handleTimeUpdate = useCallback(
    (event: JSX.TargetedEvent<HTMLVideoElement>) => {
      props.onTimeUpdate?.(event.currentTarget.currentTime);
    },
    [props.onTimeUpdate]
  );

  const handleSeeked = useCallback(
    (event: JSX.TargetedEvent<HTMLVideoElement>) => {
      props.onTimeUpdate?.(event.currentTarget.currentTime);
    },
    [props.onTimeUpdate]
  );

  return (
    <div className="vaply-videoContentNode--contentContainer">
      {/* ----- file video ----- */}
      {props.config.type === "file" && (
        <video
          poster={props.config.file.poster}
          src={props.config.file.src}
          ref={videElRef}
          controls
          preload="metadata"
          loading="lazy"
          data-testid="video-el"
          onCanPlay={handleCanPlay}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnd}
          onTimeUpdate={handleTimeUpdate}
          onSeeked={handleSeeked}
        />
      )}
    </div>
  );
};

export { VideoContentNode };
