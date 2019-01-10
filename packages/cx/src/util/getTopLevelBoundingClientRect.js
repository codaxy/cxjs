import {getParentFrameBoundingClientRect} from "./getParentFrameBoundingClientRect";

export function getTopLevelBoundingClientRect(el) {
   let bounds = el.getBoundingClientRect();
   let offset = getParentFrameBoundingClientRect(el);
   return {
      top: bounds.top + offset.top,
      left: bounds.left + offset.left,
      bottom: bounds.bottom + offset.top,
      right: bounds.right + offset.left,
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top
   }
}