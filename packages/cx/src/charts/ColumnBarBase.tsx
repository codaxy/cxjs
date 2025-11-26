/** @jsxImportSource react */

import { VDOM } from "../ui/Widget";
import { StyledContainerBase, StyledContainerConfig } from "../ui/Container";
import { tooltipMouseMove, tooltipMouseLeave, TooltipParentInstance } from "../widgets/overlay/tooltip-ops";
import { Selection } from "../ui/selection/Selection";
import { withHoverSync } from "../ui/HoverSync";
import { Prop, BooleanProp, NumberProp, StringProp } from "../ui/Prop";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { Rect } from "../svg/util/Rect";

export interface ColumnBarBaseConfig extends StyledContainerConfig {
   /** The `x` value binding or expression. */
   x?: Prop<string | number>;

   /** The `y` value binding or expression. */
   y?: Prop<string | number>;

   disabled?: BooleanProp;

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: NumberProp;

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: StringProp;

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: StringProp;

   /** Name of the item as it will appear in the legend. */
   name?: StringProp;

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: BooleanProp;

   /** Indicate that columns should be stacked on top of the other columns. Default value is `false`. */
   stacked?: BooleanProp;

   /** Name of the stack. If multiple stacks are used, each should have a unique name. Default value is `stack`. */
   stack?: StringProp;

   /** Of center offset of the column. Use this in combination with `size` to align multiple series on the same chart. */
   offset?: NumberProp;

   /** Border radius of the column/bar. */
   borderRadius?: NumberProp;

   /**
    * Name of the horizontal axis. The value should match one of the horizontal axes set
    * in the `axes` configuration of the parent `Chart` component. Default value is `x`.
    */
   xAxis?: string;

   /**
    * Name of the vertical axis. The value should match one of the vertical axes set
    *  in the `axes` configuration if the parent `Chart` component. Default value is `y`.
    */
   yAxis?: string;

   /** Name of the legend to be used. Default is `legend`. Set to `false` to hide the legend entry. */
   legend?: string | false;

   legendAction?: string;
   legendShape?: string;

   /** A value used to identify the group of components participating in hover effect synchronization. */
   hoverChannel?: string;

   /** A value used to uniquely identify the record within the hover sync group. */
   hoverId?: StringProp;

   /** Hide the bar/column rect. Used for stacked series where only top bar should be visible. */
   hidden?: BooleanProp;

   selection?: any;

   tooltip?: any;
}

export interface ColumnBarBaseInstance extends Instance, TooltipParentInstance {
   axes: Record<string, any>;
   xAxis: any;
   yAxis: any;
   hoverSync: any;
   colorMap: any;
   bounds: Rect;
}

export class ColumnBarBase extends StyledContainerBase<ColumnBarBaseConfig> {
   declare baseClass: string;
   declare xAxis: string;
   declare yAxis: string;
   declare offset: number;
   declare legend: string | false;
   declare legendAction: string;
   declare active: boolean;
   declare stacked: boolean;
   declare stack: string;
   declare legendShape: string;
   declare hoverChannel: string;
   declare borderRadius: number;
   declare hidden: boolean;
   declare selection: Selection;
   declare tooltip: any;

   constructor(config: ColumnBarBaseConfig) {
      super(config);
   }

   init(): void {
      this.selection = Selection.create(this.selection);
      super.init();
   }

   declareData(...args: any[]): any {
      var selection = this.selection.configureWidget(this);

      return super.declareData(
         selection,
         {
            x: undefined,
            y: undefined,
            style: { structured: true },
            class: { structured: true },
            className: { structured: true },
            disabled: undefined,
            colorIndex: undefined,
            colorMap: undefined,
            colorName: undefined,
            name: undefined,
            active: true,
            stacked: undefined,
            stack: undefined,
            offset: undefined,
            hoverId: undefined,
            borderRadius: undefined,
            hidden: undefined,
         },
         ...args,
      );
   }

   prepareData(context: RenderingContext, instance: ColumnBarBaseInstance): void {
      instance.axes = context.axes;
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      instance.hoverSync = context.hoverSync;
      var { data } = instance;
      data.valid = this.checkValid(data);
      if (!data.colorName && data.name) data.colorName = data.name;
      super.prepareData(context, instance);
   }

   checkValid(data: any): boolean {
      return true;
   }

   prepare(context: RenderingContext, instance: ColumnBarBaseInstance): void {
      let { data, colorMap } = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }

      if (!data.valid) return;

      if (data.active) {
         instance.bounds = this.calculateRect(instance);
         instance.cache("bounds", instance.bounds);
         if (!instance.bounds.isEqual(instance.cached.bounds)) instance.markShouldUpdate(context);

         context.push("parentRect", instance.bounds);
         if (instance.xAxis.shouldUpdate || instance.yAxis.shouldUpdate) instance.markShouldUpdate(context);
      }

      if (data.name && context.addLegendEntry)
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            selected: this.selection.isInstanceSelected(instance),
            style: data.style,
            shape: this.legendShape,
            onClick: (e: MouseEvent) => {
               this.onLegendClick(e, instance);
            },
         });
   }

   prepareCleanup(context: RenderingContext, instance: ColumnBarBaseInstance): void {
      let { data } = instance;
      if (data.valid && data.active) context.pop("parentRect");
   }

   onLegendClick(e: MouseEvent, instance: ColumnBarBaseInstance): void {
      var allActions = this.legendAction == "auto";
      var { data } = instance;
      if (allActions || this.legendAction == "toggle") if (instance.set("active", !data.active)) return;

      if (allActions || this.legendAction == "select") this.handleClick(e, instance);
   }

   calculateRect(instance: ColumnBarBaseInstance): Rect {
      throw new Error("Abstract method.");
   }

   render(context: RenderingContext, instance: ColumnBarBaseInstance, key: string): React.ReactNode {
      let { data, bounds } = instance;

      if (!data.active || !data.valid) return null;

      return withHoverSync(
         key,
         instance.hoverSync,
         this.hoverChannel,
         data.hoverId,
         ({ hover, onMouseMove, onMouseLeave, key }: any) => {
            var stateMods: Record<string, any> = {
               selected: this.selection.isInstanceSelected(instance),
               disabled: data.disabled,
               selectable: !this.selection.isDummy,
               ["color-" + data.colorIndex]: data.colorIndex != null,
               hover,
            };

            return (
               <g className={data.classNames} key={key}>
                  {!data.hidden && (
                     <rect
                        className={this.CSS.element(this.baseClass, "rect", stateMods)}
                        style={data.style}
                        x={bounds.l}
                        y={bounds.t}
                        width={bounds.width()}
                        height={bounds.height()}
                        rx={data.borderRadius}
                        onMouseMove={(e) => {
                           onMouseMove(e, instance);
                           tooltipMouseMove(e, instance, this.tooltip);
                        }}
                        onMouseLeave={(e) => {
                           onMouseLeave(e, instance);
                           tooltipMouseLeave(e, instance, this.tooltip);
                        }}
                        onClick={(e) => {
                           this.handleClick(e, instance);
                        }}
                     />
                  )}
                  {this.renderChildren(context, instance)}
               </g>
            );
         },
      );
   }

   handleClick(e: MouseEvent | React.MouseEvent, instance: ColumnBarBaseInstance): void {
      if (!this.selection.isDummy) {
         this.selection.selectInstance(instance, {
            toggle: e.ctrlKey,
         });
         e.stopPropagation();
         e.preventDefault();
      }
   }
}

ColumnBarBase.prototype.xAxis = "x";
ColumnBarBase.prototype.yAxis = "y";
ColumnBarBase.prototype.offset = 0;
ColumnBarBase.prototype.legend = "legend";
ColumnBarBase.prototype.legendAction = "auto";
ColumnBarBase.prototype.active = true;
ColumnBarBase.prototype.stacked = false;
ColumnBarBase.prototype.stack = "stack";
ColumnBarBase.prototype.legendShape = "rect";
ColumnBarBase.prototype.styled = true;
ColumnBarBase.prototype.hoverChannel = "default";
ColumnBarBase.prototype.borderRadius = 0;
ColumnBarBase.prototype.hidden = false;
