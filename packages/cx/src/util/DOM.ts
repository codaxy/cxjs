import {isNumber} from '../util/isNumber';

type ElementFilter = (el: Element, condition: (el: Element) => boolean) => Element | null;

/**
 * Returns first child element, or the parent element itself, that satisfies the `condition` function.
 * @param el
 * @param condition
 * @returns {Element}
 */
export function findFirst(el: Element, condition: (el: Element) => boolean): Element | null {
   if (condition(el))
      return el;

   var children = el.childNodes;
   if (children)
      for (var i = 0; i < children.length; i++) {
         var child = findFirst(children[i], condition);
         if (child)
            return child;
      }
   return null;
}

export function findFirstChild(el: Element, condition: (el: Element) => boolean): Element | null {
   var children = el.childNodes;
   if (children)
      for (var i = 0; i < children.length; i++) {
         var child = findFirst(children[i], condition);
         if (child)
            return child;
      }
   return null;
}

export function closest(el: Element, condition: (el: Element) => boolean): Element | null {
   while (el) {
      if (condition(el))
         return el;
      el = el.parentNode;
   }
   return null;
}

export function closestParent(el: Element, condition: (el: Element) => boolean): Element | null {
   return el && closest(el.parentNode, condition);
}

export function isFocused(el: Element): boolean {
   return document.activeElement == el;
}

export function isFocusedDeep(el: Element): boolean {
   return document.activeElement == el || (document.activeElement && el.contains(document.activeElement));
}

const focusableWithoutTabIndex = ['INPUT', 'SELECT', 'TEXTAREA', 'A', 'BUTTON'];

export function isFocusable(el: Element): boolean {
   var firstPass = el && isNumber(el.tabIndex) && el.tabIndex >= 0;
   if (!firstPass)
      return false;

   if (focusableWithoutTabIndex.indexOf(el.tagName) != -1 && !el.hasAttribute('disabled'))
      return true;

   return el.hasAttribute('tabindex');
}

/**
 * Returns focused element.
 * @returns {Element}
 */
export function getFocusedElement(): Element {
   return document.activeElement;
}

export function isDescendant(el: Element, descEl: Element): boolean {
   return el.contains(descEl);
}

export function isSelfOrDescendant(el: Element, descEl: Element): boolean {
   return el == descEl || el.contains(descEl);
}
