import {closest} from './DOM';

export function findScrollableParent(sourceEl, horizontal = false) {
   let scrollParent = sourceEl && closest(sourceEl, el => {
      if (el.nodeType != Node.ELEMENT_NODE)
         return false;
      if (!horizontal && el.clientHeight >= el.scrollHeight)
         return false;
      if (horizontal && el.clientWidth >= el.scrollWidth)
         return false;
      let overflow = getComputedStyle(el)[horizontal ? "overflow-x" : "overflow-y"];
      return overflow == "auto" || overflow == "scroll";
   });
   return scrollParent || sourceEl.ownerDocument.scrollingElement || sourceEl.ownerDocument.documentElement;
}
