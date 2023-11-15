import { NodeFlowConfig } from "@player/model";

export function getFirstNode(config: NodeFlowConfig): string | undefined {
  // default to "list" flow
  return getListFirstNode(config.list.nodes);
}

export function getPreviousNode(
  nodeId: string,
  config: NodeFlowConfig
): string | undefined {
  // default to "list" flow
  return getListPreviousNode(nodeId, config.list.nodes);
}

export function getNextNode(
  nodeId: string,
  config: NodeFlowConfig
): string | undefined {
  // default to "list" flow
  return getListNextNode(nodeId, config.list.nodes);
}

/**
 * List node flow
 *
 * List flow keeps nodes in a list and executes them sequentially.
 */

function getListFirstNode(nodes: string[]): string | undefined {
  return nodes.slice(0, 1).shift();
}

function getListPreviousNode(
  nodeId: string,
  nodes: string[]
): string | undefined {
  let previousId: string | undefined;
  let foundId: string | undefined;

  for (let i = 0; i < nodes.length; i++) {
    const id = nodes[i];
    if (id === nodeId) {
      foundId = previousId;
      break;
    }
    previousId = id;
  }

  return foundId;
}

function getListNextNode(nodeId: string, nodes: string[]): string | undefined {
  let previousId: string | undefined;
  let foundId: string | undefined;

  // we're looking for the next node so we'll iterate the arr in reverse to keep the same logic
  for (let i = nodes.length - 1; i >= 0; i--) {
    const id = nodes[i];
    if (id === nodeId) {
      foundId = previousId;
      break;
    }
    previousId = id;
  }

  return foundId;
}
