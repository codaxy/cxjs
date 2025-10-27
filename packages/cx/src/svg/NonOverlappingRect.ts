import { BoundedObject, BoundedObjectInstance, BoundedObjectConfig } from "./BoundedObject";
import { RenderingContext } from "../ui/RenderingContext";

export interface NonOverlappingRectInstance extends BoundedObjectInstance {
   overlapping?: boolean;
}

export class NonOverlappingRect extends BoundedObject<BoundedObjectConfig, NonOverlappingRectInstance> {
   prepare(context: RenderingContext, instance: NonOverlappingRectInstance) {
      super.prepare(context, instance); //calculate bounds
      if (!context.addNonOverlappingBoundingObject)
         throw new Error("Components of type NonOverlappingRect can appear only within a NonOverlappingRectGroup.");
      context.addNonOverlappingBoundingObject(instance);
   }

   render(context: RenderingContext, instance: NonOverlappingRectInstance, key: string) {
      if (instance.overlapping) return null;
      return super.render(context, instance, key);
   }
}
