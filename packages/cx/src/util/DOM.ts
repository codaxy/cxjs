import { isNumber } from "../util/isNumber";
import { getActiveElement } from "./getActiveElement";

type ElementFilter = (el: Element, condition: (el: Element) => boolean) => Element | null;

/**
 * Returns first child element, or the parent element itself, that satisfies the `condition` function.
 * @param el
 * @param condition
 * @returns {Element}
 */
export function findFirst<T extends Element>(el: Element, condition: (el: Element) => el is T): T | null;
export function findFirst(el: Element, condition: (el: Element) => boolean): Element | null;
export function findFirst(el: Element, condition: (el: Element) => boolean): Element | null {
   if (condition(el)) return el;

   var children = el.children;
   if (children)
      for (var i = 0; i < children.length; i++) {
         var child = findFirst(children[i], condition);
         if (child) return child;
      }
   return null;
}

export function findFirstChild<T extends Element>(el: Element, condition: (el: Element) => el is T): T | null;
export function findFirstChild(el: Element, condition: (el: Element) => boolean): Element | null;
export function findFirstChild(el: Element, condition: (el: Element) => boolean): Element | null {
   var children = el.children;
   if (children)
      for (var i = 0; i < children.length; i++) {
         var child = findFirst(children[i], condition);
         if (child) return child;
      }
   return null;
}

export function closest(el: HTMLElement | null, condition: (el: HTMLElement) => boolean): HTMLElement | null;
export function closest(el: Element | null, condition: (el: Element) => boolean): Element | null;
export function closest(el: Element | null, condition: (el: any) => boolean): Element | null {
   while (el) {
      if (condition(el)) return el;
      el = el.parentElement;
   }
   return null;
}

export function closestParent(el: HTMLElement, condition: (el: HTMLElement) => boolean): HTMLElement | null;
export function closestParent(el: Element, condition: (el: HTMLElement) => boolean): HTMLElement | null;
export function closestParent(el: Element, condition: (el: any) => boolean): HTMLElement | null {
   return el && closest(el.parentElement, condition);
}

export function isFocused(el: Element): boolean {
   return getActiveElement() == el;
}

export function isFocusedDeep(el: Element): boolean {
   return isSelfOrDescendant(el, getActiveElement());
}

const focusableWithoutTabIndex = ["INPUT", "SELECT", "TEXTAREA", "A", "BUTTON"];

export function isFocusable(el: Element): el is HTMLElement {
   if (!(el instanceof HTMLElement)) return false;

   var firstPass = el && isNumber(el.tabIndex) && el.tabIndex >= 0;
   if (!firstPass) return false;

   if (focusableWithoutTabIndex.indexOf(el.tagName) != -1 && !el.hasAttribute("disabled")) return true;

   return el.hasAttribute("tabindex");
}

/**
 * Returns focused element.
 * @returns {Element}
 */
export function getFocusedElement(): Element | null {
   return getActiveElement();
}

export function isDescendant(el: Element, descEl: Element): boolean {
   return el.contains(descEl);
}

//`descEl` may live in a different document than `el` (e.g. focus is inside a same-origin
//iframe) - Node.contains never crosses document boundaries, so walk out through each
//frame's <iframe> element in its parent document until we either cross into el's document
//or run out of ancestor frames.
export function isSelfOrDescendant(el: Element, descEl: Element): boolean {
   let node: Element | null | undefined = descEl;
   while (node) {
      if (el == node || el.contains(node)) return true;
      let win: Window | null = node.ownerDocument?.defaultView;
      node = win?.frameElement;
   }
   return false;
}
