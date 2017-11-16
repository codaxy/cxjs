import {closest} from './DOM';

export function findScrollableParent(sourceEl, horizontal = false) {
   let scrollParent = sourceEl && closest(sourceEl, el => {
      if (el.nodeType != Node.ELEMENT_NODE)
         return false;
      if (el.offsetHeight >= el.scrollHeight)
         return false;
      let oy = getComputedStyle(el)[horizontal ? "overflow-x" : "overflow-y"];
      return oy == "auto" || oy == "scroll";
   });
   return scrollParent || document.scrollingElement || document.documentElement;
}
