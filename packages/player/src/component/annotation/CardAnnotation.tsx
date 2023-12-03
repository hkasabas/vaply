import { FunctionComponent } from "preact";

import { AnnotationConfig } from "@player/model";
import { FilteredByType } from "@player/util/unionFilter";

/** Card annotation component props */
export type CardAnnotationProps = {
  config: FilteredByType<AnnotationConfig, "card">;

  onClose?: () => void;
};

/** Card annotation component */
const CardAnnotation: FunctionComponent<CardAnnotationProps> = (props) => {
  const cardConfig = props.config.card;

  return <div className="vaply-cardAnnotation__container">{cardConfig.title}</div>;
};

export { CardAnnotation };
