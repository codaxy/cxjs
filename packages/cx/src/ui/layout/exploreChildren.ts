import { RenderingContext } from "../RenderingContext";
import { Instance } from "../Instance";
import { View } from "../../data/View";

export function exploreChildren(
   context: RenderingContext,
   instance: Instance,
   children: any[],
   previousResult: any[] | null,
   key: any,
   store: View,
): any[] {
   let newChildren = previousResult || [];
   let oldChildren = previousResult || newChildren;
   let identical = previousResult ? 0 : -1;

   for (let c = 0; c < children.length; c++) {
      let cell = (instance as any).getChild(context, children[c], key, store);

      if ((cell as any).checkVisible(context)) {
         if (identical >= 0) {
            if (cell == oldChildren[identical]) identical++;
            else {
               newChildren = newChildren.slice(0, identical);
               identical = -1;
               newChildren.push(cell);
            }
         } else newChildren.push(cell);

         (context as any).exploreStack.push(cell);
         if ((cell as any).needsExploreCleanup) (context as any).exploreStack.push(cell);
      }
   }

   if (identical >= 0 && identical != newChildren.length) newChildren = newChildren.slice(0, identical);

   return newChildren;
}
