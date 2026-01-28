import { Widget, VDOM, getContent } from "../ui/Widget";
import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance, SvgRenderingContext } from "../svg/BoundedObject";
import { Axis } from "./axis/Axis";
import type { NumericAxis } from "./axis/NumericAxis";
import type { CategoryAxis } from "./axis/CategoryAxis";
import type { TimeAxis } from "./axis/TimeAxis";
import { RenderingContext } from "../ui/RenderingContext";
import { Create } from "../util/Component";

/** Typed context interface for chart-related context properties */
export interface ChartRenderingContext extends SvgRenderingContext {
   axes?: Record<string, any>;
}

export interface ChartConfig extends BoundedObjectConfig {
   /** Axis definition. Each key represent an axis, and each value hold axis configuration. */
   axes?: Record<
      string,
      Create<typeof Axis> | Create<typeof NumericAxis> | Create<typeof CategoryAxis> | Create<typeof TimeAxis>
   >;

   /** Put axes over data series. */
   axesOnTop?: boolean;
}

export interface ChartInstance extends BoundedObjectInstance {
   calculators: Record<string, any>;
   axes: Record<string, any>;
}

export class Chart extends BoundedObject<ChartConfig, ChartInstance> {
   declare axes: Record<string, any>;
   declare axesOnTop: boolean;

   constructor(config?: ChartConfig) {
      super(config);
   }

   init(): void {
      super.init();

      // Clone axes to avoid mutating the original config
      let axesConfig = this.axes || {};
      this.axes = {};

      for (let axis in axesConfig) {
         this.axes[axis] = Axis.create(axesConfig[axis]);
      }
   }

   explore(context: ChartRenderingContext, instance: ChartInstance): void {
      instance.calculators = { ...context.axes };

      context.push("axes", instance.calculators);
      instance.axes = {};

      //axes need to be registered before children to be processed first
      for (let axis in this.axes) {
         let axisInstance = instance.getChild(context, this.axes[axis]);
         if (axisInstance.scheduleExploreIfVisible(context)) {
            instance.axes[axis] = axisInstance;
            instance.calculators[axis] = this.axes[axis].report(context, axisInstance);
         }
      }

      super.explore(context, instance);
   }

   exploreCleanup(context: ChartRenderingContext, instance: ChartInstance): void {
      context.pop("axes");

      for (let axis in instance.axes) {
         instance.axes[axis].widget.reportData(context, instance.axes[axis]);
      }
   }

   prepare(context: ChartRenderingContext, instance: ChartInstance): void {
      context.push("axes", instance.calculators);
      super.prepare(context, instance);
   }

   prepareCleanup(context: ChartRenderingContext, instance: ChartInstance): void {
      context.pop("axes");
      super.prepareCleanup(context, instance);
   }

   render(context: ChartRenderingContext, instance: ChartInstance, key: string): any[] {
      let axes = [];
      for (let k in instance.axes) {
         axes.push(getContent(instance.axes[k].render(context, key + "-axis-" + k)));
      }

      let result = [];

      if (!this.axesOnTop) result.push(axes);

      result.push(this.renderChildren(context, instance));

      if (this.axesOnTop) result.push(axes);

      return result;
   }
}

Chart.prototype.anchors = "0 1 1 0";
Chart.prototype.styled = true;
Chart.prototype.isPureContainer = true;
Chart.prototype.axesOnTop = false;

Widget.alias("chart", Chart);
