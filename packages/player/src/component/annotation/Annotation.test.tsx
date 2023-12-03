import { screen } from "@testing-library/dom";
import { fireEvent, render } from "@testing-library/preact";
import { ComponentType, Fragment, h } from "preact";

import { Annotation } from "@player/component/annotation/Annotation";
import { AnnotationConfig } from "@player/model";
import { createAnnotation } from "@player/util/testUtils";

// we export common annotation tests so they can be tested against each annotation type
// eslint-disable-next-line jest/no-export
export function commonTests(annotation: AnnotationConfig, wrapper?: ComponentType) {
  const CmpWrapper = wrapper ?? Fragment;

  describe("common", () => {
    it("dismissible can be dismissed", () => {
      // pick any annotation
      const annot = createAnnotation(annotation, { dismissible: true });
      const closeHandler = jest.fn();

      // render
      render(<Annotation config={annot} onClose={closeHandler} />, { wrapper: CmpWrapper });

      const closeBtn = screen.getByText<HTMLDivElement>("×");
      fireEvent.click(closeBtn);

      expect(closeHandler).toHaveBeenCalledTimes(1);
    });

    it("undismissible does not show close button", () => {
      // pick any annotation
      const annot = createAnnotation(annotation, { dismissible: false });

      // render
      render(<Annotation config={annot} />, { wrapper: CmpWrapper });

      const closeBtn = screen.queryByText<HTMLDivElement>("×");

      expect(closeBtn).toBeNull();
    });

    it("applies static positioning", () => {
      // pick any annotation
      const annot = annotation;

      // render
      const result1 = render(<Annotation config={annot} />, { wrapper: CmpWrapper });
      expect(result1.container).toMatchSnapshot();

      // rerender with changed positioning
      const annot2 = createAnnotation(annotation, { position: { static: { top: "1px", right: "1px", bottom: "1px", left: "1px" } } });
      const result2 = render(<Annotation config={annot2} />, { wrapper: CmpWrapper });
      expect(result2.container).toMatchSnapshot();
    });

    it("applies dimensions", () => {
      // pick any annotation
      const annot = annotation;

      // render
      const result1 = render(<Annotation config={annot} />, { wrapper: CmpWrapper });
      expect(result1.container).toMatchSnapshot();

      // rerender with changed dimensions
      const annot2 = createAnnotation(annotation, { dimensions: { width: "1px", height: "1px" } });
      const result2 = render(<Annotation config={annot2} />, { wrapper: CmpWrapper });
      expect(result2.container).toMatchSnapshot();

      // rerender with no dimensions
      const annot3 = createAnnotation(annotation, { dimensions: undefined });
      const result3 = render(<Annotation config={annot3} />, { wrapper: CmpWrapper });
      expect(result3.container).toMatchSnapshot();
    });
  });
}

describe("annotation", () => {
  // make jest ignore the fact that there are no tests in this file
  it.skip("dummy", () => {});
});
