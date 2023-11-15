import { AnnotationConfig, AnnotationTriggerConfig, AnnotationTriggerType } from "@player/model";
import { assertUnreachable } from "@player/util/utils";

/** Typeguard fn that TS compiler understands when used in filters. */
function isNotEmpty<T>(obj: T): obj is NonNullable<T> {
  return obj != null;
}

export function findApplicableAnnotations(
  position: string,
  type: AnnotationTriggerType,
  availableAnnotations: AnnotationConfig[],
  triggers: AnnotationTriggerConfig[]
): AnnotationConfig[] {
  return (
    triggers
      // trigger by type
      .filter((trigger) => {
        return trigger.type === type;
      })
      // trigger by time
      .filter((trigger) => {
        return isActiveAnnotation(position, trigger);
      })
      // map trigger to annotation
      .map((trigger) => {
        return availableAnnotations.find((ann) => ann.code === trigger.targetCode);
      })
      // remove empty - triggers with targets not found in
      .filter(isNotEmpty)
  );
}

/** Remove previously closed annotations from given available annotation list. */
export function findActiveAnnotations(availableAnnotations: AnnotationConfig[], closedAnnotations: AnnotationConfig[]): AnnotationConfig[] {
  return (
    availableAnnotations
      // remove already closed
      .filter((cAnnot) => {
        return closedAnnotations.find((annot) => annot.code == cAnnot.code) == null;
      })
  );
}

/** Helper function which checks if there are any blocking annotations in given annotation list. */
export function hasBlockingAnnotations(availableAnnotations: AnnotationConfig[]): boolean {
  return (
    availableAnnotations
      // is there at least one that is blocking
      .some((annot) => annot.blocking)
  );
}

/** Return "start" specific for trigger type. */
export function findTriggerStart(trigger: AnnotationTriggerConfig): string | number | undefined {
  const type = trigger.type;
  switch (type) {
    case "route":
      return trigger.route.start;
    case "timeupdate":
      return trigger.timeupdate.start;
    default:
      assertUnreachable(type);
  }
}

// ----------

function isActiveAnnotation(position: string, trigger: AnnotationTriggerConfig): boolean {
  if (trigger.type === "timeupdate") {
    // in case of timeupdate annotations, position is number
    const timeNumber = Number.parseInt(position, 10);
    if (!Number.isNaN(timeNumber)) {
      // TODO: remove "as any"
      return (
        trigger.timeupdate != null &&
        (trigger.timeupdate.start as any) <= timeNumber &&
        (trigger.timeupdate.end == null || (trigger.timeupdate.end as any) > timeNumber)
      );
    }
    // NaN? no need to worry. This could be one of special routes that we just don't handle here yet
  }

  return false;
}
