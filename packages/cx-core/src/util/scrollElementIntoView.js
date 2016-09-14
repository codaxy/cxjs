import {closest} from './DOM';

export function scrollElementIntoView(el) {
   var parentEl = closest(el, p=>p.scrollHeight > p.offsetHeight);
   if (!parentEl)
      return false;
   var pr = parentEl.getBoundingClientRect();
   var er = el.getBoundingClientRect();

   if (er.bottom > pr.bottom)
      parentEl.scrollTop = Math.max(0, parentEl.scrollTop + er.bottom - pr.bottom);

   if (er.top < pr.top)
      parentEl.scrollTop = Math.max(0, parentEl.scrollTop + er.top - pr.top);

   return true;
}

