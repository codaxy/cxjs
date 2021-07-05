import { PureContainer } from "../ui/PureContainer";

export class NonOverlappingRectGroup extends PureContainer {
   prepare(context, instance) {
      instance.nonOverlappingObjects = [];
      context.push("addNonOverlappingBoundingObject", objectInstance => {
         instance.nonOverlappingObjects.push(objectInstance);
      });
   }

   prepareCleanup(context, instance) {
      context.pop("addNonOverlappingBoundingObject");
      instance.nonOverlappingObjects.sort((a, b) => (a.data.bounds.r - b.data.bounds.r));
      let visibleObjects = [];
      for (let item of instance.nonOverlappingObjects) {
         let overlapping = false;
         let at = visibleObjects.length - 1;
         while (at >= 0 && visibleObjects[at].data.bounds.r > item.data.bounds.l) {
            let r1 = visibleObjects[at].data.bounds;
            let r2 = item.data.bounds;
            let width = Math.min(r1.r, r2.r) - Math.max(r1.l, r2.l);
            let height = Math.min(r1.b, r2.b) - Math.max(r1.t, r2.t);
            if (width > 0 && height > 0) {
               overlapping = true;
               break;
            }
            at--;
         }
         if (item.overlapping !== overlapping) {
            item.overlapping = overlapping;
            item.markShouldUpdate(context);
         }
         if (!overlapping)
            visibleObjects.push(item);
      }
   }
}