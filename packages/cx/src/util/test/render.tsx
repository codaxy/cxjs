/** @jsxImportSource react */
import { act as reactAct } from "react";
import {
   cleanup as cleanupRendered,
   render as renderReact,
   RenderOptions as ReactRenderOptions,
   RenderResult as ReactRenderResult,
} from "vitest-browser-react/pure";
import { Store } from "../../data/Store";
import { View } from "../../data/View";
import { ResolvedCultureInfo } from "../../ui/Culture";
import { Cx } from "../../ui/Cx";

// Test utilities for rendering CxJS content in Vitest browser mode, modelled on vitest-browser-react:
//
//    const screen = await render(<cx><div text={bind("name")} /></cx>, { store });
//    await settle(() => store.set("name", "Jack"));
//    assert.equal(screen.html(), "<div>Jack</div>");

export interface CxRenderOptions {
   /** The store the content is bound to. Defaults to a new, empty `Store`. */
   store?: View;
   /** The culture used for formatting, e.g. `createCulture({ timezone: "UTC" })`. Defaults to the current culture. */
   cultureInfo?: ResolvedCultureInfo;
}

/** `CxRenderOptions` plus the options of `vitest-browser-react`'s `render` (`container`, `wrapper`, ...). */
export interface RenderOptions extends CxRenderOptions, ReactRenderOptions {}

/**
 * The result of `vitest-browser-react`'s `render` (`container`, locators such as `getByText`, `unmount`, ...),
 * with `rerender` taking CxJS content, plus `store` and `html()`.
 */
export interface RenderResult extends Omit<ReactRenderResult, "rerender"> {
   /** The store the content is bound to. */
   store: View;
   /** Returns the rendered HTML, one element per line (see `formatHTML`). Compare it with a `markup` template. */
   html(): string;
   /**
    * Renders into the same root. Options that are not given keep their previous values.
    * The same content updates in place (e.g. with a new store or culture), like a Cx root in an application.
    * Different content is mounted anew, because a Cx root builds its widget tree only once.
    */
   rerender(widget: any, options?: CxRenderOptions): Promise<void>;
}

/** Renders CxJS content (e.g. `<cx>...</cx>`) into a new container attached to `document.body`. */
export async function render(widget: any, options: RenderOptions = {}): Promise<RenderResult> {
   let { store = new Store(), cultureInfo, ...renderOptions } = options;
   let current: CxRenderOptions = { store, cultureInfo };
   let currentWidget = widget;
   let mountKey = 0;
   let result = await renderReact(cxElement(widget, current, mountKey), renderOptions);
   let screen: RenderResult = {
      ...result,
      store,
      html: () => formatHTML(result.container),
      rerender: async (widget, options = {}) => {
         current = { ...current, ...options };
         screen.store = current.store!;
         if (widget !== currentWidget) {
            currentWidget = widget;
            mountKey++;
         }
         await result.rerender(cxElement(widget, current, mountKey));
      },
   };
   return screen;
}

function cxElement(widget: any, { store, cultureInfo }: CxRenderOptions, key: number) {
   return <Cx key={key} widget={widget} store={store} cultureInfo={cultureInfo} subscribe immediate />;
}

/** Unmounts everything rendered with `render` and removes the containers. */
export async function cleanup() {
   await cleanupRendered();
}

let activeSettles = 0;

/**
 * Runs `callback` (a store change, an interaction, ...) and waits until React has rendered its result.
 * Use it when the test checks the DOM, or that something did not happen, right after triggering an update.
 * For results of asynchronous work (promises, timers), use `expect.poll` instead.
 *
 * Like `vitest-browser-react`, React's act environment is enabled only while `settle` runs, so updates
 * outside of it behave as in an application and do not produce act(...) warnings.
 */
export async function settle(callback: () => unknown = () => {}): Promise<void> {
   activeSettles++;
   (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
   try {
      await reactAct(async () => {
         await callback();
      });
   } finally {
      activeSettles--;
      (globalThis as any).IS_REACT_ACT_ENVIRONMENT = activeSettles > 0;
   }
}

/**
 * Formats the HTML of a node's children with one element per line, indented by nesting depth.
 * An element whose content is only text stays on one line, e.g. `<span class="x">Text</span>`.
 * Attributes and text are serialized as in `innerHTML`, except that newlines in text are written as `&#10;`
 * and trailing spaces of a text line as `&#32;`. Comments are omitted.
 */
export function formatHTML(parent: Node): string {
   let lines: string[] = [];
   parent.childNodes.forEach((node) => formatNode(node, 0, lines));
   return lines.join("\n");
}

/**
 * Template tag for expected HTML. Removes the common indentation and the leading and trailing
 * blank lines, so expectations can be written indented to match the code around them.
 */
export function markup(strings: TemplateStringsArray, ...values: any[]): string {
   let text = strings.reduce((result, s, i) => result + s + (i < values.length ? String(values[i]) : ""), "");
   let lines = text.split("\n");
   while (lines.length > 0 && lines[0].trim() == "") lines.shift();
   while (lines.length > 0 && lines[lines.length - 1].trim() == "") lines.pop();
   let indent = Math.min(...lines.filter((l) => l.trim() != "").map((l) => l.match(/^ */)![0].length));
   return lines.map((l) => l.slice(indent)).join("\n");
}

function formatNode(node: Node, depth: number, lines: string[]) {
   let indent = "   ".repeat(depth);
   if (node.nodeType == Node.TEXT_NODE) {
      // trailing spaces are written as &#32; so that editors which trim trailing whitespace keep expectations intact
      let text = escapeText(node.textContent ?? "");
      lines.push(indent + text.replace(/ +$/, (spaces) => "&#32;".repeat(spaces.length)));
      return;
   }
   if (node.nodeType != Node.ELEMENT_NODE) return;

   let el = node as Element;
   let shallow = (el.cloneNode(false) as Element).outerHTML;
   let closeTag = `</${el.localName}>`;
   let openTag = shallow.endsWith(closeTag) ? shallow.slice(0, -closeTag.length) : shallow;
   if (!shallow.endsWith(closeTag)) closeTag = ""; // void element, e.g. <input>

   let children = Array.from(el.childNodes).filter(
      (n) => n.nodeType == Node.TEXT_NODE || n.nodeType == Node.ELEMENT_NODE,
   );
   if (children.every((n) => n.nodeType == Node.TEXT_NODE)) {
      lines.push(indent + openTag + children.map((n) => escapeText(n.textContent ?? "")).join("") + closeTag);
      return;
   }
   lines.push(indent + openTag);
   children.forEach((child) => formatNode(child, depth + 1, lines));
   lines.push(indent + closeTag);
}

// escapes text as innerHTML does; newlines are written as &#10; to keep one node per line
function escapeText(text: string) {
   return text
      .replace(/&/g, "&amp;")
      .replace(/\u00a0/g, "&nbsp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "&#10;");
}
