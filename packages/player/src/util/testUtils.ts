import { AnnotationConfig } from "@player/model";
import { DeepPartial } from "@player/util/lang";
import { FilteredByType, typeFind } from "@player/util/unionFilter";
import { merge } from "@player/util/utils";

// ---------- Annotation test utils

/**
 * Uses full annotation `config` and applies partial `changes` to it  and returns new config object.
 *
 * Useful when you need to change just some specific details on an existing config.
 */
export function createAnnotation<T extends AnnotationConfig["type"]>(
  config: FilteredByType<AnnotationConfig, T>,
  changes: DeepPartial<FilteredByType<AnnotationConfig, T>>
) {
  return merge(config, changes);
}

/** Find and return the first annotation of specific `type` from the list.
 * Returns `undefined` if none found.
 */
export function findAnnotation<T extends AnnotationConfig["type"]>(list: AnnotationConfig[], type: T) {
  const annotation = typeFind(list, type);

  if (annotation == null) {
    throw `Annotation with ${type} not found in list`;
  }

  return annotation;
}
