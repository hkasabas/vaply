export type NodePlayerConfig = NodePackageConfig & {
  flow: NodeFlowConfig;
  nodes: Array<
    ContentNodeConfig & {
      annotations: Array<AnnotationConfig>;
      // triggers connecting content movement and annotations
      triggers: Array<AnnotationTriggerConfig>;
    }
  >;
};

export type NodePackageConfig = {
  id: string;
  title: string;
};

export type NodeFlowType = "list";
export type NodeFlowConfig = {
  type: NodeFlowType;
  // [<NodeFlowType>]: {},
  list: {
    nodes: string[];
  };
};

export type ContentNodeConfig = {
  code: string; // custom generated ID for internal referencing (eg. positioning)

  video: VideoContentConfig;
};

export type VideoContentType = "file";
export interface VideoContentConfig {
  type: VideoContentType;

  // [<VideoContentType>]: {},
  file?: FileVideoContentConfig;
}

export interface FileVideoContentConfig {
  src: string;
  poster?: string;
}

export type AnnotationType = "card" | "externalcontent" | "chapter";
export type AnnotationPositionType = "static" | "none";
export type AnnotationConfig = {
  code: string;
  type: AnnotationType;
  blocking?: boolean;
  dismissible?: boolean;

  position: {
    type: "static";

    static: Partial<{
      top: string; // CSS dimensions
      right: string; // CSS dimensions
      bottom: string; // CSS dimensions
      left: string; // CSS dimensions
    }>;
  };

  dimensions?: Partial<{
    width: string; // CSS dimensions
    height: string; // CSS dimensions
  }>;
} & (
  | { type: "card"; card: CardAnnotationConfig }
  | { type: "externalcontent"; externalcontent: ExternalContentAnnotationConfig }
  | { type: "chapter"; chapter: ChapterAnnotationConfig }
);

export type CardAnnotationConfig = {
  title?: string;
};
export type ExternalContentAnnotationConfig = {
  selector: string;
};
export type ChapterAnnotationConfig = {
  title: string;
};

export type AnnotationTriggerType = "timeupdate" | "route";
export type AnnotationTriggerConfig =
  | {
      targetCode: string; // annotation code
      type: "timeupdate";
      timeupdate: {
        start: string | number;
        end?: string | number;
      };
    }
  | {
      targetCode: string; // annotation code
      type: "route";
      route: {
        start: string | number;
      };
    };

// ---------- events

export type RouteEvent = string;

export type ObjectValue<T> = { value: T | undefined };
