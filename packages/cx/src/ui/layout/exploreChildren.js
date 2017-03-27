export function exploreChildren(context, instance, children, previousResult, key, store, beforeCallback, afterCallback) {
   let newChildren = previousResult || [];
   let oldChildren = previousResult || newChildren;
   let identical = previousResult ? 0 : -1;

   for (let c = 0; c < children.length; c++) {
      let cell = instance.getChild(context, children[c], key, store);
      if (beforeCallback)
         beforeCallback(cell);
      if (cell.explore(context)) {
         if (identical >= 0) {
            if (cell == oldChildren[identical])
               identical++;
            else {
               newChildren = newChildren.slice(0, identical);
               identical = -1;
               newChildren.push(cell);
            }
         }
         else
            newChildren.push(cell);

         if (afterCallback)
            afterCallback(cell);
      }
   }

   if (identical >= 0 && identical != newChildren.length)
      newChildren = newChildren.slice(0, identical);

   return newChildren;
}
