import { fireEvent, render } from "@testing-library/preact";
import { h } from "preact";
import { screen } from "@testing-library/dom";

import { Annotation } from "@player/component/annotation/Annotation";
import { AnnotationConfig } from "@player/model";
import { createAnnotation, findAnnotation } from "@player/util/testUtils";

describe("annotations", () => {
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

  describe("common", () => {
    it("dismissible can be dismissed", () => {
      // pick any annotation
      const annot = createAnnotation(findAnnotation(ANNOTATIONS, "card"), { dismissible: true });
      const closeHandler = jest.fn();

      // render
      render(<Annotation config={annot} onClose={closeHandler} />);

      const closeBtn = screen.getByText<HTMLDivElement>("×");
      fireEvent.click(closeBtn);

      expect(closeHandler).toHaveBeenCalledTimes(1);
    });

    it("undismissible does not show close button", () => {
      // pick any annotation
      const annot = createAnnotation(findAnnotation(ANNOTATIONS, "card"), { dismissible: false });

      // render
      render(<Annotation config={annot} />);

      const closeBtn = screen.queryByText<HTMLDivElement>("×");

      expect(closeBtn).toBeNull();
    });

    it("applies static positioning", () => {
      // pick any annotation
      const annot = findAnnotation(ANNOTATIONS, "card");

      // render
      const result1 = render(<Annotation config={annot} />);
      expect(result1.asFragment()).toMatchSnapshot();

      // rerender with changed positioning
      const annot2 = createAnnotation(findAnnotation(ANNOTATIONS, "card"), { position: { static: { top: "1px", right: "1px", bottom: "1px", left: "1px" } } });
      const result2 = render(<Annotation config={annot2} />);
      expect(result2.asFragment()).toMatchSnapshot();
    });

    it("applies dimensions", () => {
      // pick any annotation
      const annot = findAnnotation(ANNOTATIONS, "card");

      // render
      const result1 = render(<Annotation config={annot} />);
      expect(result1.asFragment()).toMatchSnapshot();

      // rerender with changed dimensions
      const annot2 = createAnnotation(findAnnotation(ANNOTATIONS, "card"), { dimensions: { width: "1px", height: "1px" } });
      const result2 = render(<Annotation config={annot2} />);
      expect(result2.asFragment()).toMatchSnapshot();

      // rerender with no dimensions
      const annot3 = createAnnotation(findAnnotation(ANNOTATIONS, "card"), { dimensions: undefined });
      const result3 = render(<Annotation config={annot3} />);
      expect(result3.asFragment()).toMatchSnapshot();
    });
  });

  describe("card", () => {
    it("renders", () => {
      const annot = findAnnotation(ANNOTATIONS, "card");

      // render
      const result1 = render(<Annotation config={annot} />);
      expect(result1.asFragment()).toMatchSnapshot();
    });

    it("displays title", () => {
      const annot = findAnnotation(ANNOTATIONS, "card");

      // render
      const result1 = render(<Annotation config={annot} />);
      expect(result1.asFragment()).toMatchSnapshot();

      // rerender with changed title
      const annot2 = createAnnotation(findAnnotation(ANNOTATIONS, "card"), { card: { title: annot.card.title + "2" } });
      const result2 = render(<Annotation config={annot2} />);
      expect(result2.asFragment()).toMatchSnapshot();
    });
  });
});
