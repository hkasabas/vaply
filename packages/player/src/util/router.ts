/**
 *
 * Node router
 *
 * Collection of methods for handling routing addresses
 *
 * There are two main structures:
 *  - address - string containing concatenated parts of route spearated by divider symbol
 *  - route - data structure with props for each distinct address part
 *
 * Id address doesn't contain divider, presume address is in format `NODE@POSITION`, otherwise presume `ADDRESS`
 */

const ADDRESS_DIVIDER_SYMBOL = '@';
const ANNOTATED_POSITION_SYMBOL = '#';

export type NodeRoute = {
  nodeCode?: string;
  position?: string;
};

// ----- special routes

/** Route that points to the start of targeted node */
export const NODE_ROUTE_NODE_START = 'NODE_START';
/** Route that points to the end of targeted node */
export const NODE_ROUTE_NODE_END = 'NODE_END';
/** Route that points to the next node */
export const NODE_ROUTE_NEXT_NODE = 'NEXT_NODE';
/** Route that points to the previous node */
export const NODE_ROUTE_PREVIOUS_NODE = 'PREVIOUS_NODE';

// ----- route/address

export function addressToRoute(address: string): NodeRoute {
  // if divider is present, presume address "NODE@POSITION", otherwise presum "ADDRESS"
  const parts = address.indexOf(ADDRESS_DIVIDER_SYMBOL) != -1 ? address.split(ADDRESS_DIVIDER_SYMBOL) : [undefined, address];

  return createRoute(...parts);
}

export function routeToAddress(route: NodeRoute): string {
  return createAddress(route.nodeCode, route.position);
}

export function createRoute(...parts: (string | undefined)[]): NodeRoute {
  return {
    nodeCode: parts[0],
    position: parts[1],
  };
}

export function createAddress(...parts: (string | undefined)[]): string {
  return parts.slice(0, 2).join(ADDRESS_DIVIDER_SYMBOL);
}

// ----- annotated positions

export function isAnnotatedPosition(position: string | undefined): boolean {
  return position != null ? position.startsWith(ANNOTATED_POSITION_SYMBOL) : false;
}

export function getAnnotatedPosition(position: string | undefined): string | undefined {
  return position != null ? position.substring(ANNOTATED_POSITION_SYMBOL.length) : undefined;
}
