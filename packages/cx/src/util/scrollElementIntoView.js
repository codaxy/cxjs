import {findScrollableParent} from './findScrollableParent';
import {getScrollerBoundingClientRect} from './getScrollerBoundingClientRect';

export function scrollElementIntoView(el, vertical = true, horizontal = false) {
   if (horizontal) {
      let parentEl = findScrollableParent(el, true);
      if (parentEl) {
         let pr = getScrollerBoundingClientRect(parentEl);
         let er = el.getBoundingClientRect();
         let scrollbarWidth = parentEl.offsetWidth - parentEl.clientWidth;

         if (er.right > pr.right - scrollbarWidth)
            parentEl.scrollLeft = Math.max(0, parentEl.scrollLeft + er.right - pr.right + scrollbarWidth);

         if (er.left < pr.left)
            parentEl.scrollLeft = Math.max(0, parentEl.scrollLeft + er.left - pr.left);
      }
   }

   if (vertical) {
      let parentEl = findScrollableParent(el);
      if (parentEl) {

         let pr = getScrollerBoundingClientRect(parentEl);
         let er = el.getBoundingClientRect();
         let scrollbarHeight = parentEl.offsetHeight - parentEl.clientHeight;

         if (er.bottom > pr.bottom - scrollbarHeight)
            parentEl.scrollTop = Math.max(0, parentEl.scrollTop + er.bottom - pr.bottom + scrollbarHeight);

         if (er.top < pr.top)
            parentEl.scrollTop = Math.max(0, parentEl.scrollTop + er.top - pr.top);
      }
   }
}

