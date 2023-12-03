import { render } from "preact";

import { NodePlayer } from "@player/component/NodePlayer";
import { NodePlayerConfig } from "@player/model";

export type VaplyPlayerProps = {
  currentAddress?: string;
  config: NodePlayerConfig;
};

/**
 * Create player widget and renders it to root element
 */
export function createPlayer(rootElSelector: string, props: VaplyPlayerProps) {
  const el = document.querySelector(rootElSelector);

  function renderOrUpdateComponent(props: VaplyPlayerProps) {
    const currentAddress = props.currentAddress != null ? { value: props.currentAddress } : undefined;

    if (el != null) {
      render(<NodePlayer config={props.config} currentAddress={currentAddress} />, el);
    }
  }

  // initial render
  renderOrUpdateComponent(props);

  function setAddress(address: string) {
    // update on address change
    renderOrUpdateComponent({
      ...props,
      currentAddress: address?.toString(),
    });
  }

  return {
    setAddress,
  };
}
