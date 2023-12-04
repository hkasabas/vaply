import { fireEvent, render } from "@testing-library/preact";
import { FunctionComponent } from "preact";
import { useRef } from "preact/hooks";

import { useDomEvent, useDomEventOnce } from "@player/component/hook/useDomEvent";

type TestComponentProps = { onClick?: () => void; onClickOnce?: () => void; renderComponent?: boolean };

/** Test component that handles button clicks */
const TestComponent: FunctionComponent<TestComponentProps> = (props) => {
  const ref = useRef<HTMLButtonElement>(null);

  props.onClick && useDomEvent(ref, "click", props.onClick);
  props.onClickOnce && useDomEventOnce(ref, "click", props.onClickOnce);

  return <>{(props.renderComponent ?? true) && <button ref={ref}>Click Me</button>}</>;
};

describe("useDomEvent", () => {
  describe("multiple", () => {
    test("should handle multiple event and unsubscribe afterwards", async () => {
      const handleClickFn = jest.fn();

      const result = render(<TestComponent onClick={handleClickFn} />);
      const button = result.getByText("Click Me");

      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClickFn).toHaveBeenCalledTimes(2);

      // TODO: test that handler has been unsubscribed after component unmount
      // renderer doesn't seem to run effect cleanup function after unmount
      // https://github.com/testing-library/react-hooks-testing-library/issues/847
    });
  });

  describe("once", () => {
    test("should handle an event once", async () => {
      const handleClickOnceFn = jest.fn();

      const result1 = render(<TestComponent onClickOnce={handleClickOnceFn} />);
      const button = result1.getByText("Click Me");

      // click twice
      fireEvent.click(button);
      fireEvent.click(button);

      // only click should be recorded
      expect(handleClickOnceFn).toHaveBeenCalledTimes(1);
    });
  });
});
