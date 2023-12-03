import { render } from "@testing-library/preact";
import { FunctionComponent, RenderableProps, h } from "preact";

import { Annotation } from "@player/component/annotation/Annotation";
import { commonTests } from "@player/component/annotation/Annotation.test";
import { AnnotationConfig } from "@player/model";
import { findAnnotation } from "@player/util/testUtils";

// ---------- Wrapper component

type WrapperComponentProps = RenderableProps<{ renderAnnotation?: boolean }>;

/**
 * Wrapper component that wraps rendered annotation component and adds external content elements that the annotation can use.
 */
const WrapperComponent: FunctionComponent<WrapperComponentProps> = (props) => {
  return (
    <div>
      {/* set static HTML content that the component can move around */}
      {/* eslint-disable-next-line react/no-danger */}
      <div id="externalContentContainer" dangerouslySetInnerHTML={{ __html: '<div id="externalcontent-annot-1">This is an annotation</div>' }} />

      {(props.renderAnnotation ?? true) && props.children}
    </div>
  );
};
/**
 * Factory functions that renders WrapperComponent with default `renderAnnotation` prop.
 *
 * Wrapper component is rendered outside of our control so we cannot pass new props to it.
 * This way we provide a generic component which in turn renders `WrapperComponent` with desired props.
 */
const wrapperComponentFactory = (renderAnnotation?: boolean) => {
  return (props: WrapperComponentProps) => <WrapperComponent renderAnnotation={renderAnnotation}>{props.children}</WrapperComponent>;
};

describe("external content annotations", () => {
  // --- prepared mock data
  const ANNOTATIONS: AnnotationConfig[] = [
    {
      code: "annot-externalcontent-1",
      type: "externalcontent",
      blocking: true,
      dismissible: true,
      position: { type: "static", static: { right: "5px", top: "50%" } },
      externalcontent: { selector: "#externalcontent-annot-1" },
    },
  ];

  // run common tests

  commonTests(findAnnotation(ANNOTATIONS, "externalcontent"), WrapperComponent);

  // run "externalcontent" specific tests
  describe("externalcontent", () => {
    it("renders", () => {
      const annot = findAnnotation(ANNOTATIONS, "externalcontent");

      // render
      const result1 = render(<Annotation config={annot} />, { wrapper: wrapperComponentFactory() });
      expect(result1.container).toMatchSnapshot();
    });

    it("contains external content", async () => {
      const annot = findAnnotation(ANNOTATIONS, "externalcontent");

      // --- test annotation component mounting
      // render
      const result1 = render(<Annotation config={annot} />, { wrapper: wrapperComponentFactory() });

      // ext. content no longer in it's container
      const prevEl1 = result1.container.querySelector<HTMLDivElement>(`#externalContentContainer #externalcontent-annot-1`);
      expect(prevEl1).toBeNull();

      // ext. content is in annotation
      const newEl1 = result1.container.querySelector<HTMLDivElement>(`.vaply-externalContentAnnotation__container #externalcontent-annot-1`);
      expect(newEl1).not.toBeNull();

      // --- test annotation component UNmounting
      // rerender without annotation
      const result2 = render(<Annotation config={annot} />, { wrapper: wrapperComponentFactory(false) });

      // ext. content no longer in annotation
      const prevEl2 = result2.container.querySelector<HTMLDivElement>(`#externalContentContainer #externalcontent-annot-1`);
      expect(prevEl2).not.toBeNull();

      // ext. content back in it's container
      const newEl2 = result2.container.querySelector<HTMLDivElement>(`.vaply-externalContentAnnotation__container #externalcontent-annot-1`);
      expect(newEl2).toBeNull();
    });
  });
});
