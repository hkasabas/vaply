import { FunctionComponent, h } from "preact";

import { AnnotationConfig, RouteEvent } from "@player/model";
import { FilteredByType } from "@player/util/typeFilter";

/** Card annotation component props */
export type CardAnnotationProps = {
  config: FilteredByType<AnnotationConfig, "card">;

  onRoute?: (route: RouteEvent) => void;
  onClose?: () => void;
};

/** Card annotation component */
const CardAnnotation: FunctionComponent<CardAnnotationProps> = (props) => {
  const cardConfig = props.config.card;

  return <div className="vaply-cardAnnotation__container">{cardConfig.title}</div>;
};

export { CardAnnotation };
