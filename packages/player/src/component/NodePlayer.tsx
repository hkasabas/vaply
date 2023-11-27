import { h, FunctionComponent } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

import { ContentNode } from "@player/component/ContentNode";
import { NodeFlowConfig, NodePlayerConfig, ObjectValue } from "@player/model";
import { getFirstNode, getNextNode, getPreviousNode } from "@player/util/flow";
import { addressToRoute, createRoute, NodeRoute, NODE_ROUTE_NEXT_NODE, NODE_ROUTE_PREVIOUS_NODE } from "@player/util/router";

// TODO: import from path alias @player
import "../style/index.less";

/** Node player component props */
export interface NodePlayerProps {
  /**
   * Position content at specific node and position.
   *
   * This is an object to force triggering component update on repeated changes (which a simple string won't)
   */
  currentAddress?: ObjectValue<string>;

  /** Player node config */
  config: NodePlayerConfig;
}

/**Node player component
 *
 * This is the main entry component for a player. It comunicates with outside world,
 * resolves current node from address, displays it and handles all navigation between nodes.
 */
const NodePlayer: FunctionComponent<NodePlayerProps> = (props) => {
  const [currentAddress, setCurrentAddress] = useState<string | undefined>(props.currentAddress?.value);

  // this is the top component and we cannot pull this state upwards
  // so we need to use useEffect because this is syncing with "external system"
  useEffect(() => {
    setCurrentAddress(props.currentAddress?.value);
  }, [props.currentAddress?.value]);

  const currentRoute = useMemo(() => resolveRouteNode(currentAddress, props.config.flow), [currentAddress, props.config.flow]);
  // current node
  const currentNode = useMemo(
    () => (currentRoute != null ? props.config.nodes.find((n) => n.code === currentRoute.nodeCode) : undefined),
    [currentRoute, props.config]
  );

  const currentNodeAnnotations = useMemo(() => {
    const currentNode = currentRoute != null ? props.config.nodes.find((n) => n.code === currentRoute.nodeCode) : undefined;
    return currentNode?.annotations ?? [];
  }, [currentRoute, props.config.nodes]);

  const currentNodeTriggers = useMemo(() => {
    const currentNode = currentRoute != null ? props.config.nodes.find((n) => n.code === currentRoute.nodeCode) : undefined;
    return currentNode?.triggers ?? [];
  }, [currentRoute, props.config.nodes]);

  // ---------- event handlers

  // route event
  const handleNodeRoute = useCallback(
    (address: string | undefined) => {
      setCurrentAddress(address);
    },
    [setCurrentAddress]
  );

  return (
    <div className="vaply-nodePlayer__container">
      {currentNode && (
        <ContentNode config={currentNode} route={currentRoute} annotations={currentNodeAnnotations} triggers={currentNodeTriggers} onRoute={handleNodeRoute} />
      )}
    </div>
  );
};

function resolveRouteNode(address: string | undefined, flow: NodeFlowConfig): NodeRoute | undefined {
  let route: NodeRoute | undefined = address != null ? addressToRoute(address) : undefined;

  // empty address, fallback to the first node that flow returns
  if (route == null || route?.nodeCode == null) {
    route = route ?? {}; // initialize with empty obj if empty

    route = createRoute(getFirstNode(flow), route.position);

    if (route.nodeCode == null) throw "Cannot detect route node! Is the node flow empty?!";
  }

  if (route.position != null) {
    // next
    if (route.position === NODE_ROUTE_NEXT_NODE) {
      const nextNode = getNextNode(route.nodeCode, flow);
      if (nextNode != null) {
        // position is relative so ignore it in new route
        route = { nodeCode: nextNode };
      }
    }
    // previous
    else if (route.position === NODE_ROUTE_PREVIOUS_NODE) {
      const previousNode = getPreviousNode(route.nodeCode, flow);
      if (previousNode != null) {
        // position is relative so ignore it in new route
        route = { nodeCode: previousNode };
      }
    }
    // leave everything as is
  }

  return route;
}

export { NodePlayer };
