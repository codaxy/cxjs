import { findScrollableParent } from "./findScrollableParent";
import { getScrollerBoundingClientRect } from "./getScrollerBoundingClientRect";

export function scrollElementIntoView(
   el,
   vertical = true,
   horizontal = false,
   inflate = 0
) {
   if (horizontal) {
      let parentEl = findScrollableParent(el, true);
      if (parentEl) {
         let pr = getScrollerBoundingClientRect(parentEl);
         let er = el.getBoundingClientRect();
         let scrollbarWidth = parentEl.offsetWidth - parentEl.clientWidth;

         if (er.right + inflate > pr.right - scrollbarWidth)
            parentEl.scrollLeft = Math.max(
               0,
               parentEl.scrollLeft +
                  er.right +
                  inflate -
                  pr.right +
                  scrollbarWidth
            );

         if (er.left - inflate < pr.left)
            parentEl.scrollLeft = Math.max(
               0,
               parentEl.scrollLeft + er.left - inflate - pr.left
            );
      }
   }

   if (vertical) {
      let parentEl = findScrollableParent(el);
      if (parentEl) {
         let pr = getScrollerBoundingClientRect(parentEl);
         let er = el.getBoundingClientRect();
         let scrollbarHeight = parentEl.offsetHeight - parentEl.clientHeight;

         if (er.bottom + inflate > pr.bottom - scrollbarHeight)
            parentEl.scrollTop = Math.max(
               0,
               parentEl.scrollTop +
                  er.bottom +
                  inflate -
                  pr.bottom +
                  scrollbarHeight
            );

         if (er.top - inflate < pr.top)
            parentEl.scrollTop = Math.max(
               0,
               parentEl.scrollTop + er.top - inflate - pr.top
            );
      }
   }
}
