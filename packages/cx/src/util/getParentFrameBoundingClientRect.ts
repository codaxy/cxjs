export function getParentFrameBoundingClientRect(el: Element): DOMRect {
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
   return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
}
