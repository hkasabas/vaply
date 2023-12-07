import { render } from "@testing-library/preact";
import { h } from "preact";

import { Annotation } from "@player/component/annotation/Annotation";
import { commonTests } from "@player/component/annotation/Annotation.test";
import { AnnotationConfig } from "@player/model";
import { createAnnotation, findAnnotation } from "@player/util/testUtils";

describe("card annotations", () => {
  // --- prepared mock data
  const ANNOTATIONS: AnnotationConfig[] = [
    {
      code: "annot-card-1",
      type: "card",
      position: { type: "static", static: { top: "5px", right: "5px" } },
      dimensions: { width: "100%", height: "100%" },
      card: { title: "This is annotation #1" },
      dismissible: true,
    },
  ];

  // run common tests
  commonTests(findAnnotation(ANNOTATIONS, "card"));

  // run "card" specific tests
  describe("card", () => {
    it("renders", () => {
      const annot = findAnnotation(ANNOTATIONS, "card");

      // render
      const result1 = render(<Annotation config={annot} />);
      expect(result1.container).toMatchSnapshot();
    });

    it("displays title", () => {
      const annot = findAnnotation(ANNOTATIONS, "card");

      // render
      const result1 = render(<Annotation config={annot} />);
      expect(result1.container).toMatchSnapshot();

      // rerender with changed title
      const annot2 = createAnnotation(findAnnotation(ANNOTATIONS, "card"), { card: { title: annot.card.title + "2" } });
      const result2 = render(<Annotation config={annot2} />);
      expect(result2.container).toMatchSnapshot();
    });
  });
});
