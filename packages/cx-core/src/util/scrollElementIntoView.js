import {findScrollableParent} from './findScrollableParent';
import {getScrollerBoundingClientRect} from './getScrollerBoundingClientRect';

export function scrollElementIntoView(el) {
   let parentEl = findScrollableParent(el);
   if (!parentEl)
      return false;

   let pr = getScrollerBoundingClientRect(parentEl);
   let er = el.getBoundingClientRect();

   if (er.bottom > pr.bottom)
      parentEl.scrollTop = Math.max(0, parentEl.scrollTop + er.bottom - pr.bottom);

   if (er.top < pr.top)
      parentEl.scrollTop = Math.max(0, parentEl.scrollTop + er.top - pr.top);

   return true;
}

