/** @jsxImportSource react */

import { Widget, VDOM, WidgetConfig } from "../ui/Widget";
import { getShape } from "./shapes";
import { Selection } from "../ui/selection/Selection";
import { stopPropagation } from "../util/eventCallbacks";
import { isUndefined } from "../util/isUndefined";
import { Container, ContainerConfig } from "../ui/Container";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, BooleanProp, StringProp } from "../ui/Prop";

export interface LegendEntryConfig extends ContainerConfig {
   /** Set to `true` if the entry is selected. */
   selected?: BooleanProp;

   /** Shape to display. Default is `square`. */
   shape?: StringProp;

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: NumberProp;

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: StringProp;

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: StringProp;

   /** Name of the entry. */
   name?: StringProp;

   /** Used to indicate if an entry is active or not. */
   active?: BooleanProp;

   /** Size of the shape in pixels. Default is `18`. */
   size?: NumberProp;

   /** Horizontal border radius. */
   rx?: NumberProp;

   /** Vertical border radius. */
   ry?: NumberProp;

   /** Text content of the entry. */
   text?: StringProp;

   /** Action to perform on click. Default is `auto`. */
   legendAction?: string;

   /** Size of the SVG container in pixels. Default is `20`. */
   svgSize?: number;

   /** Selection configuration. */
   selection?: any;

   /** Click event handler. */
   onClick?: (e: React.MouseEvent, instance: Instance) => void | false;
}

export interface LegendEntryInstance extends Instance {
   colorMap: any;
}

export class LegendEntry extends Container {
   declare baseClass: string;
   declare shape: string;
   declare legendAction: string;
   declare size: number;
   declare svgSize: number;
   declare selection: Selection;
   declare text: string;
   declare onClick: LegendEntryConfig["onClick"];

   constructor(config: LegendEntryConfig) {
      super(config);
   }

   init(): void {
      this.selection = Selection.create(this.selection);
      super.init();
   }

   declareData(...args: any[]): void {
      var selection = this.selection.configureWidget(this);

      super.declareData(...args, selection, {
         selected: undefined,
         shape: undefined,
         colorIndex: undefined,
         colorMap: undefined,
         colorName: undefined,
         name: undefined,
         active: true,
         size: undefined,
         rx: undefined,
         ry: undefined,
         text: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: LegendEntryInstance): void {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context: RenderingContext, instance: LegendEntryInstance): void {
      var { data } = instance;
      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);
      super.explore(context, instance);
   }

   prepare(context: RenderingContext, instance: LegendEntryInstance): void {
      var { data, colorMap } = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }
   }

   handleClick(e: React.MouseEvent, instance: LegendEntryInstance): void {
      if (this.onClick && instance.invoke("onClick", e, instance) === false) return;

      e.stopPropagation();

      var any = this.legendAction == "auto";

      if (any || this.legendAction == "toggle") if (instance.set("active", !instance.data.active)) return;

      if ((any || this.legendAction == "select") && !this.selection.isDummy) this.selection.selectInstance(instance);
   }

   render(context: RenderingContext, instance: LegendEntryInstance, key: string): React.ReactNode {
      let { data } = instance;
      let content = !isUndefined(this.text) ? data.text : this.renderChildren(context, instance);
      return (
         <div
            key={key}
            className={data.classNames}
            style={data.style}
            onMouseDown={stopPropagation}
            onClick={(e) => {
               this.handleClick(e, instance);
            }}
         >
            {this.renderShape(instance)}
            {content != null && <div>{content}</div>}
         </div>
      );
   }

   renderShape(instance: LegendEntryInstance): React.ReactNode {
      var entry = instance.data;
      var className = this.CSS.element(this.baseClass, "shape", {
         disabled: entry.disabled,
         selected: entry.selected || this.selection.isInstanceSelected(instance),
         [`color-${entry.colorIndex}`]: entry.colorIndex != null && (isUndefined(entry.active) || entry.active),
      });
      var shape = getShape(entry.shape || "square");

      // if the entry has a custom fill or stroke set, use it for both values
      let style = { ...entry.style };
      style.fill = style.fill ?? style.stroke;
      style.stroke = style.stroke ?? style.fill;

      return (
         <svg
            key="svg"
            className={this.CSS.element(this.baseClass, "svg")}
            style={{
               width: `${this.svgSize}px`,
               height: `${this.svgSize}px`,
            }}
         >
            {shape(this.svgSize / 2, this.svgSize / 2, entry.size, {
               style,
               className,
               rx: entry.rx,
               ry: entry.ry,
            })}
         </svg>
      );
   }
}

LegendEntry.prototype.baseClass = "legendentry";
LegendEntry.prototype.shape = "square";
LegendEntry.prototype.legendAction = "auto";
LegendEntry.prototype.size = 18;
LegendEntry.prototype.svgSize = 20;
LegendEntry.prototype.styled = true;

Widget.alias("legend-entry", LegendEntry);
