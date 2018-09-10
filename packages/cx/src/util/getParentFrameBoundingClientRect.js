export function getParentFrameBoundingClientRect(el) {
   if (el.ownerDocument == document) {
      return {
         top: 0,
         left: 0,
         right: window.innerWidth,
         bottom: window.innerHeight,
         width: window.innerWidth,
         height: window.innerHeight
      };
   }

   let frames = document.getElementsByTagName("iframe");

   for (let i = 0; i < frames.length; i++) {
      if (frames[i].contentDocument == el.ownerDocument) {
         return frames[i].getBoundingClientRect();
      }
   }
}