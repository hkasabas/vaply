import { render } from "@testing-library/preact";
import { h } from "preact";
import { screen } from "@testing-library/dom";

import { Annotation } from "@player/component/annotation/Annotation";
import { MOCK } from "@player/dev";
import { AnnotationConfig } from "@player/model";
import { typeFind } from "@player/util/typeFilter";

describe("annotations", () => {
  describe("card", () => {
    it("renders", () => {
      const annot = ensureAnnotation(MOCK.nodes[0].annotations, "card");
      render(<Annotation config={annot} />);

      const el = screen.getByText(annot.card.title!);
      expect(el).toContainHTML(annot.card.title!);
    });
  });
});

function ensureAnnotation<T extends AnnotationConfig["type"]>(list: AnnotationConfig[], type: T) {
  const annotation = typeFind(list, "card");

  if (annotation == null) {
    throw `Annotation with ${type} not found in list`;
  }

  return annotation;
}
