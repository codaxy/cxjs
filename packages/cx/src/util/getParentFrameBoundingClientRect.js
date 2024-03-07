export function getParentFrameBoundingClientRect(el) {
   // if the ownerDocument is null, the element itself is the document
   let ownerDocument = el.ownerDocument || el;
   if (ownerDocument != document) {
      let frames = document.getElementsByTagName("iframe");
      for (let i = 0; i < frames.length; i++) {
         if (frames[i].contentDocument == ownerDocument) {
            return frames[i].getBoundingClientRect();
         }
      }
   }

   return {
      top: 0,
      left: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight,
   };
}
