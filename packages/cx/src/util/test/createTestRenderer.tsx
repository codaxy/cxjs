/** @jsxImportSource react */
import { act, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Cx } from "../../ui/Cx";
import { View } from "../../data/View";

/** A rendered element in the format previously produced by `react-test-renderer`'s `toJSON()`. */
export interface TestNode {
   type: string;
   props: Record<string, any>;
   children: (TestNode | string)[] | null;
}

export type TestJSON = TestNode | TestNode[] | null;

export interface TestRenderer {
   /** The DOM element the content is rendered into. It is attached to `document.body`. */
   container: HTMLElement;
   /** Returns the rendered DOM as a `{ type, props, children }` tree. */
   toJSON(): TestJSON;
   /** Renders new content into the same root. Wrap the call in `act`. */
   update(element: ReactNode): void;
   unmount(): void;
}

let mounted = new Set<TestRenderer>();

/** Renders a React element into a new container attached to `document.body`. Requires a DOM. */
export async function renderToDOM(element: ReactNode): Promise<TestRenderer> {
   let container = document.createElement("div");
   document.body.appendChild(container);
   let root = createRoot(container);

   let result: TestRenderer = {
      container,
      toJSON: () => toJSON(container),
      update: (element) => root.render(element),
      unmount: () => {
         if (!mounted.delete(result)) return;
         act(() => root.unmount());
         container.remove();
      },
   };
   mounted.add(result);

   await act(async () => {
      root.render(element);
   });
   return result;
}

export async function createTestRenderer(store: View, widget: any): Promise<TestRenderer> {
   return renderToDOM(createTestWidget(store, widget));
}

export function createTestWidget(store: View, widget: any) {
   return <Cx widget={widget} store={store} subscribe immediate />;
}

/** Unmounts everything rendered with `renderToDOM` or `createTestRenderer`. */
export function cleanup() {
   for (let renderer of [...mounted]) renderer.unmount();
}

/**
 * Converts rendered DOM into the `{ type, props, children }` format that `react-test-renderer` produced.
 * `props` are the props React rendered the element with (read from the property React keeps on each DOM
 * node), so they match what the element was given, including event handlers and style objects.
 */
export function toJSON(container: Node): TestJSON {
   // like react-test-renderer, the result is typed as elements; top-level text is returned as a string
   let nodes = convertChildren(container) as TestNode[];
   if (nodes.length == 0) return null;
   if (nodes.length == 1) return nodes[0];
   return nodes;
}

function convertChildren(parent: Node): (TestNode | string)[] {
   let result: (TestNode | string)[] = [];
   parent.childNodes.forEach((node) => {
      if (node.nodeType == Node.TEXT_NODE) result.push(node.textContent ?? "");
      else if (node.nodeType == Node.ELEMENT_NODE) result.push(convertElement(node as Element));
   });
   return result;
}

function convertElement(el: Element): TestNode {
   let reactProps = getReactProps(el);
   let props: Record<string, any> = {};
   if (reactProps) {
      for (let key in reactProps) if (key != "children") props[key] = reactProps[key];
   } else {
      for (let attr of Array.from(el.attributes)) props[attr.name] = attr.value;
   }
   let children = props.dangerouslySetInnerHTML ? [] : convertChildren(el);
   return {
      type: el.localName,
      props,
      children: children.length > 0 ? children : null,
   };
}

function getReactProps(el: Element): Record<string, any> | undefined {
   // React stores the props as an own property of the element; inherited DOM properties don't need checking
   let key = Object.keys(el).find((key) => key.startsWith("__reactProps$"));
   return key ? (el as any)[key] : undefined;
}

export { act };
