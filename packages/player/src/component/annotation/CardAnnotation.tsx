import { FunctionComponent, h } from "preact";

import { AnnotationConfig, RouteEvent, TypedUnion } from "@player/model";

/** Card annotation component props */
export type CardAnnotationProps = {
  config: TypedUnion<AnnotationConfig, "card">;

  onRoute?: (route: RouteEvent) => void;
  onClose?: () => void;
};

/** Card annotation component */
const CardAnnotation: FunctionComponent<CardAnnotationProps> = (props) => {
  const cardConfig = props.config.card;

  return <div className="vaply-cardAnnotation__container">{cardConfig.title}</div>;
};

export { CardAnnotation };
