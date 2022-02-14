import { BoundedObject, Rect } from "cx/svg";

export class PieLabelsContainer extends BoundedObject {

   prepare(context, instance) {
      super.prepare(context, instance);
      let { bounds } = instance.data;
      let cx2 = (bounds.l + bounds.r);

      context.push('placePieLabel', (labelBounds, distance) => {
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

      context.push('registerPieLabel', (label) => {
         if (label.actualBounds.l + label.actualBounds.r < cx2)
            instance.leftLabels.push(label);
         else instance.rightLabels.push(label);
      });
   }

   prepareCleanup(context, instance) {
      context.pop('placePieLabel');
      context.pop('registerPieLabel');
      super.prepareCleanup(context, instance);
      this.distributeLabels(instance.leftLabels, instance);
      this.distributeLabels(instance.rightLabels, instance);
   }

   distributeLabels(labels, instance) {
      labels.sort((a, b) => (a.actualBounds.t + a.actualBounds.b) - (b.actualBounds.t + b.actualBounds.b));
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

PieLabelsContainer.prototype.anchors = '0 1 1 0';

export class PieLabel extends BoundedObject {

   declareData(...args) {
      super.declareData(...args, {
         distance: undefined
      });
   }

   calculateBounds(context, instance) {
      var { data } = instance;
      var bounds = Rect.add(Rect.add(Rect.multiply(instance.parentRect, data.anchors), data.offset), data.margin);
      instance.originalBounds = bounds;
      instance.actualBounds = context.placePieLabel(bounds, data.distance);
      return new Rect({ t: 0, r: bounds.width(), b: bounds.height(), l: 0 });
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      if (!context.registerPieLabel)
         throw new Error('PieLabel components are allowed only within PieLabelsContainer components.');
      context.registerPieLabel(instance);
   }

   render(context, instance, key) {
      let { originalBounds, actualBounds } = instance;

      return <g>
         <line
            x1={actualBounds.l < originalBounds.l ? actualBounds.r : actualBounds.l}
            y1={(actualBounds.t + actualBounds.b) / 2}
            x2={(originalBounds.l + originalBounds.r) / 2}
            y2={(originalBounds.t + originalBounds.b) / 2}
            stroke="gray"
         />
         <g key={key} transform={`translate(${instance.actualBounds.l} ${instance.actualBounds.t})`}>
            {this.renderChildren(context, instance)}
         </g>
      </g>
   }
}

PieLabel.prototype.distance = 100;