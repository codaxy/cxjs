import {getParentFrameBoundingClientRect} from "./getParentFrameBoundingClientRect";
import {getTopLevelBoundingClientRect} from "./getTopLevelBoundingClientRect";

export function getScrollerBoundingClientRect(scrollEl: Element, topLevel: boolean = false): ClientRect {
   if (scrollEl == scrollEl.ownerDocument.body || scrollEl == scrollEl.ownerDocument.documentElement) {
      if (topLevel)
         return getParentFrameBoundingClientRect(scrollEl.ownerDocument.body);

      return {
         left: 0,
         top: 0,
         right: window.innerWidth,
         bottom: window.innerHeight,
         width: window.innerWidth,
         height: window.innerHeight
      };
   }

   return topLevel
      ? getTopLevelBoundingClientRect(scrollEl)
      : scrollEl.getBoundingClientRect();
}