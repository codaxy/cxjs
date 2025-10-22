import { VDOM as vdom } from "cx-react";

import type * as React from "react";
import type { Component } from "react";
import type {
   unstable_batchedUpdates,
   render,
   findDOMNode,
   createPortal,
   unstable_renderSubtreeIntoContainer,
   hydrate,
   unmountComponentAtNode,
} from "react-dom";
import type { createRoot, hydrateRoot, Root } from "react-dom/client";

export interface VDOMType extends Omit<typeof React, "default"> {
   allowRenderOutputCaching?: boolean;
   Component: typeof Component;

   DOM: {
      unstable_batchedUpdates: typeof unstable_batchedUpdates;
      render: typeof render;
      findDOMNode: typeof findDOMNode;
      createPortal: typeof createPortal;
      createRoot: typeof createRoot;
      hydrateRoot: typeof hydrateRoot;
      hydrate: typeof hydrate;
      unmountComponentAtNode: typeof unmountComponentAtNode;
      unstable_renderSubtreeIntoContainer: typeof unstable_renderSubtreeIntoContainer;
   };
}

export const VDOM = vdom as VDOMType;
