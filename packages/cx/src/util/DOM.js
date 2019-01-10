import {isNumber} from '../util/isNumber';

export function findFirst(el, condition) {
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

export function findFirstChild(el, condition) {
   var children = el.childNodes;
   if (children)
      for (var i = 0; i < children.length; i++) {
         var child = findFirst(children[i], condition);
         if (child)
            return child;
      }
   return null;
}

export function closest(el, condition) {
   while (el) {
      if (condition(el))
         return el;
      el = el.parentNode;
   }
   return null;
}

export function closestParent(el, condition) {
   return el && closest(el.parentNode, condition);
}

export function isFocused(el) {
   return document.activeElement == el;
}

export function isFocusedDeep(el) {
   return document.activeElement == el || (document.activeElement && el.contains(document.activeElement));
}

const focusableWithoutTabIndex = ['INPUT', 'SELECT', 'TEXTAREA', 'A', 'BUTTON'];

export function isFocusable(el) {
   var firstPass = el && isNumber(el.tabIndex) && el.tabIndex >= 0;
   if (!firstPass)
      return false;

   if (focusableWithoutTabIndex.indexOf(el.tagName) != -1 && !el.hasAttribute('disabled'))
      return true;

   return el.hasAttribute('tabindex');
}

export function getFocusedElement() {
   return document.activeElement;
}

export function isDescendant(el, descEl) {
   return el.contains(descEl);
}

export function isSelfOrDescendant(el, descEl) {
   return el == descEl || el.contains(descEl);
}
