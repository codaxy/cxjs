import { getParentFrameBoundingClientRect } from "./getParentFrameBoundingClientRect";
import { getTopLevelBoundingClientRect } from "./getTopLevelBoundingClientRect";

export function getScrollerBoundingClientRect(scrollEl: Element, topLevel: boolean = false): DOMRect {
   if (scrollEl == scrollEl.ownerDocument.body || scrollEl == scrollEl.ownerDocument.documentElement) {
      if (topLevel) return getParentFrameBoundingClientRect(scrollEl.ownerDocument.body);

      return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
   }

   return topLevel ? getTopLevelBoundingClientRect(scrollEl) : scrollEl.getBoundingClientRect();
}
