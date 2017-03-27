export function getScrollerBoundingClientRect(scrollEl) {
   if (scrollEl == document.body || scrollEl == document.documentElement)
      return {
         left: 0,
         top: 0,
         right: window.innerWidth,
         bottom: window.innerHeight,
         width: window.innerWidth,
         height: window.innerHeight
      };

   return scrollEl.getBoundingClientRect();
}