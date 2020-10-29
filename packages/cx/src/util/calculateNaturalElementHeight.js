export function calculateNaturalElementHeight(el) {
   if (el.scrollHeight > el.clientHeight) return naturalElementHeight(el);
   let h = el.offsetHeight;
   for (let i = 0; i < el.children.length; i++) {
      let child = el.children[i];
      if (child.scrollHeight > child.clientHeight) {
         h -= child.offsetHeight;
         h += naturalElementHeight(child);
      }
   }
   return h;
}

function naturalElementHeight(el) {
   let h = el.offsetHeight;
   let overflow = el.scrollHeight - el.clientHeight;
   if (overflow <= 0) return h;
   let computedStyle = getComputedStyle(el);
   let maxH = computedStyle.getPropertyValue("max-height");
   if (maxH) return Math.min(parseFloat(maxH), h + overflow);
   return h + overflow;
}
