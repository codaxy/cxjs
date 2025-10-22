/** @jsxImportSource react */

import { Widget, VDOM } from "../Widget";
import { Store } from "../../data/Store";
import { Cx } from "../Cx";
import { Instance } from "../Instance";

export interface StartAppLoopOptions {
   destroyDelay?: number;
   removeParentDOMElement?: boolean;
   [key: string]: any;
}

export function startAppLoop(
   parentDOMElement: HTMLElement,
   storeOrInstance?: Store | Instance,
   widget?: typeof Widget,
   options: StartAppLoopOptions = {},
): () => void {
   if (!parentDOMElement || parentDOMElement.nodeType !== 1)
      throw new Error("First argument to startAppLoop should be a valid DOM element.");

   let store: Store | undefined;
   let instance: Instance | undefined;
   let parentInstance: Instance | undefined;

   if (!storeOrInstance) storeOrInstance = new Store();

   if ((storeOrInstance as any).notify) store = storeOrInstance as Store;
   else if ((storeOrInstance as any).getChild) {
      if ((storeOrInstance as any).widget === widget) instance = storeOrInstance as Instance;
      else parentInstance = storeOrInstance as Instance;
   } else throw new Error("Second argument to startAppLoop should be either of type Store or Instance");

   let content = (
      <Cx
         store={store}
         widget={widget}
         instance={instance}
         parentInstance={parentInstance}
         options={options}
         subscribe
      />
   ) as any;

   let root: any = null;
   if (VDOM.DOM.createRoot) {
      root = VDOM.DOM.createRoot(parentDOMElement);
      root.render(content);
   } else VDOM.DOM.render(content, parentDOMElement);

   let stopped = false;

   return function () {
      if (stopped) return;

      stopped = true;

      if (!options.destroyDelay) destroy(parentDOMElement, options, root);
      else {
         setTimeout(() => {
            destroy(parentDOMElement, options, root);
         }, options.destroyDelay);
      }
   };
}

function destroy(parentDOMElement: HTMLElement, options: StartAppLoopOptions, root: any): void {
   if (root) root.unmount();
   else VDOM.DOM.unmountComponentAtNode(parentDOMElement);

   if (options.removeParentDOMElement && parentDOMElement.parentNode)
      parentDOMElement.parentNode.removeChild(parentDOMElement);
}
