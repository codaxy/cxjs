import { BoundedObject } from "./BoundedObject";

export class NonOverlappingRect extends BoundedObject {
   prepare(context, instance) {
      super.prepare(context, instance); //calculate bounds
      if (!context.addNonOverlappingBoundingObject)
         throw new Error("Components of type NonOverlappingRect can appaear only within a NonOverlappingRectGroup.");
      context.addNonOverlappingBoundingObject(instance);
   }

   render(context, instance, key) {
      if (instance.overlapping) return null;
      return super.render(context, instance, key);
   }
}