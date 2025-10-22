import { getParentFrameBoundingClientRect } from "./getParentFrameBoundingClientRect";

export function getTopLevelBoundingClientRect(el: Element): DOMRect {
   let bounds = el.getBoundingClientRect();
   let offset = getParentFrameBoundingClientRect(el);
   return new DOMRect(bounds.left + offset.left, bounds.top + offset.top, bounds.width, bounds.height);
}
