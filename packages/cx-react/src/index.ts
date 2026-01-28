import React from "react";
import { unstable_batchedUpdates, createPortal } from "react-dom";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";

export type { Root };

export interface CxVDOM extends Omit<typeof React, "DOM"> {
   allowRenderOutputCaching?: boolean;
   DOM: {
      unstable_batchedUpdates: typeof unstable_batchedUpdates;
      createPortal: typeof createPortal;
      createRoot: typeof createRoot;
      hydrateRoot: typeof hydrateRoot;
   };
}

const vdom = React as CxVDOM;
vdom.DOM = {
   unstable_batchedUpdates,
   createPortal,
   createRoot,
   hydrateRoot,
};

export const VDOM = vdom;
