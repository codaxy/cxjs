import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import { RenderingContext } from "../ui/RenderingContext";
import { PieLabelInstance } from "./PieLabel";

export interface PieLabelsContainerConfig extends BoundedObjectConfig {}

export interface PieLabelsContainerInstance extends BoundedObjectInstance {
   leftLabels: PieLabelInstance[];
   rightLabels: PieLabelInstance[];
}

export class PieLabelsContainer extends BoundedObject {
   constructor(config: PieLabelsContainerConfig) {
      super(config);
   }

   prepare(context: RenderingContext, instance: PieLabelsContainerInstance): void {
      super.prepare(context, instance);
      let { bounds } = instance.data;
      let cx2 = bounds.l + bounds.r;

      context.push("placePieLabel", (labelBounds: Rect, distance: number): Rect => {
         let clone = new Rect(labelBounds);
         let w = clone.r - clone.l;
         if (clone.l + clone.r > cx2) {
            clone.r = Math.min(clone.r + distance, bounds.r);
            clone.l = clone.r - w;
         } else {
            clone.l = Math.max(bounds.l, clone.l - distance);
            clone.r = clone.l + w;
         }
         return clone;
      });

      instance.leftLabels = [];
      instance.rightLabels = [];

      context.push("registerPieLabel", (label: PieLabelInstance): void => {
         if (label.actualBounds.l + label.actualBounds.r < cx2) instance.leftLabels.push(label);
         else instance.rightLabels.push(label);
      });
   }

   prepareCleanup(context: RenderingContext, instance: PieLabelsContainerInstance): void {
      context.pop("placePieLabel");
      context.pop("registerPieLabel");
      super.prepareCleanup(context, instance);
      this.distributeLabels(instance.leftLabels, instance);
      this.distributeLabels(instance.rightLabels, instance);
   }

   distributeLabels(labels: PieLabelInstance[], instance: PieLabelsContainerInstance): void {
      labels.sort((a, b) => a.actualBounds.t + a.actualBounds.b - (b.actualBounds.t + b.actualBounds.b));
      let totalHeight = labels.reduce((h, l) => h + l.actualBounds.height(), 0);
      let { bounds } = instance.data;
      let avgHeight = Math.min(totalHeight, bounds.height()) / labels.length;
      let at = bounds.t;
      for (let i = 0; i < labels.length; i++) {
         let ab = labels[i].actualBounds;
         ab.t = Math.max(at, Math.min(ab.t, bounds.b - (labels.length - i) * avgHeight));
         ab.b = ab.t + avgHeight;
         at = ab.b;
      }
   }
}

PieLabelsContainer.prototype.anchors = "0 1 1 0";
