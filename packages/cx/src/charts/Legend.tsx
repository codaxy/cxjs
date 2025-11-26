/** @jsxImportSource react */

import { Widget, VDOM, WidgetConfig } from "../ui/Widget";
import { HtmlElement, HtmlElementConfig, HtmlElementInstance } from "../widgets/HtmlElement";
import { PureContainer } from "../ui/PureContainer";
import { getShape } from "./shapes";
import { isUndefined } from "../util/isUndefined";
import { isNonEmptyArray } from "../util/isNonEmptyArray";
import { parseStyle } from "../util/parseStyle";
import { withHoverSync } from "../ui/HoverSync";
import { Format } from "../util/Format";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { StringProp, StyleProp, BooleanProp } from "../ui/Prop";

export interface LegendEntryData {
   name: string;
   displayText?: string;
   active?: boolean;
   colorIndex?: number;
   disabled?: boolean;
   selected?: boolean;
   style?: any;
   shape?: string;
   shapeSize?: number;
   hoverSync?: any;
   hoverChannel?: string;
   hoverId?: any;
   onClick?: (e: MouseEvent) => void;
   value?: number;
}


export interface LegendConfig extends HtmlElementConfig {
   /** Name of the legend. Default is `legend`. */
   name?: string;

   /** Default shape to use for all entries. */
   shape?: StringProp;

   /** Style applied to each entry. */
   entryStyle?: StyleProp;

   /** CSS class applied to each entry. */
   entryClass?: StringProp;

   /** Style applied to the value display. */
   valueStyle?: StyleProp;

   /** CSS class applied to the value display. */
   valueClass?: StringProp;

   /** Set to `true` to show values next to legend entries. */
   showValues?: BooleanProp;

   /** Format used for displaying values. Default is `s`. */
   valueFormat?: string;

   /** Set to `true` for vertical layout. */
   vertical?: boolean;

   /** Size of the shape in pixels. Default is `18`. */
   shapeSize?: number;

   /** Size of the SVG container in pixels. Default is `20`. */
   svgSize?: number;
}

export interface LegendInstance extends HtmlElementInstance {
   legends: Record<string, { entries: LegendEntryData[]; names: Record<string, LegendEntryData> }>;
}

export class Legend extends HtmlElement {
   declare baseClass: string;
   declare name: string;
   declare vertical: boolean;
   declare shapeSize: number;
   declare shape: string | null;
   declare svgSize: number;
   declare showValues: boolean;
   declare valueFormat: string;
   declare entryStyle: any;
   declare valueStyle: any;

   static Scope: typeof PureContainer;

   constructor(config: LegendConfig) {
      super(config);
   }

   declareData(...args: any[]): void {
      super.declareData(...args, {
         shape: undefined,
         entryStyle: { structured: true },
         entryClass: { structured: true },
         valueStyle: { structured: true },
         valueClass: { structured: true },
         showValues: undefined,
      });
   }

   init(): void {
      this.entryStyle = parseStyle(this.entryStyle);
      this.valueStyle = parseStyle(this.valueStyle);
      super.init();
   }

   prepareData(context: RenderingContext, instance: LegendInstance): void {
      let { data } = instance;
      data.stateMods = Object.assign(data.stateMods || {}, {
         vertical: this.vertical,
      });
      super.prepareData(context, instance);
   }

   isValidHtmlAttribute(attrName: string): string | false {
      switch (attrName) {
         case "shapeSize":
         case "svgSize":
         case "shape":
         case "entryStyle":
         case "entryClass":
         case "valueStyle":
         case "valueClass":
         case "showValues":
         case "valueFormat":
            return false;

         default:
            return super.isValidHtmlAttribute(attrName);
      }
   }

   explore(context: RenderingContext, instance: LegendInstance): void {
      if (!context.legends) context.legends = {};

      instance.legends = context.legends;

      context.addLegendEntry = (legendName: string | false, entry: LegendEntryData) => {
         if (!legendName) return;

         //case when all legends are scoped and new entry is added outside the scope
         if (!context.legends) return;

         let legend = context.legends[legendName];
         if (!legend)
            legend = context.legends[legendName] = {
               entries: [],
               names: {},
            };

         if (!legend.names[entry.name]) {
            legend.entries.push(entry);
            legend.names[entry.name] = entry;
         }
      };

      super.explore(context, instance);
   }

   renderChildren(context: RenderingContext, instance: LegendInstance): React.ReactNode[] {
      const CSS = this.CSS;

      let entries = instance.legends[this.name] && instance.legends[this.name].entries,
         list: React.ReactNode;

      let { entryClass, entryStyle, shape, valueClass, valueStyle } = instance.data;
      let valueFormatter = Format.parse(this.valueFormat);

      let valueClasses = this.showValues ? CSS.expand(CSS.element(this.baseClass, "value"), valueClass) : undefined;
      let entryTextClass = CSS.element(this.baseClass, "entry-text");

      if (isNonEmptyArray(entries)) {
         list = entries.map((e: LegendEntryData, i: number) =>
            withHoverSync(i, e.hoverSync, e.hoverChannel, e.hoverId, ({ onMouseMove, onMouseLeave, hover }) => (
               <div
                  key={i}
                  className={CSS.expand(
                     CSS.element(this.baseClass, "entry", {
                        "color-root": true,
                        hover,
                        disabled: e.disabled,
                        selected: e.selected,
                     }),
                     entryClass,
                  )}
                  style={entryStyle}
                  onClick={e.onClick as any}
                  onMouseMove={onMouseMove}
                  onMouseLeave={onMouseLeave}
               >
                  {this.renderShape(e, shape)}
                  <div className={entryTextClass}>{e.displayText || e.name}</div>
                  {this.showValues && (
                     <div className={valueClasses} style={valueStyle}>
                        {valueFormatter(e.value)}
                     </div>
                  )}
               </div>
            )),
         );
      }

      return [list, super.renderChildren(context, instance)];
   }

   renderShape(entry: LegendEntryData, legendEntriesShape: string | null | undefined): React.ReactNode {
      const className = this.CSS.element(this.baseClass, "shape", {
         [`color-${entry.colorIndex}`]: entry.colorIndex != null && (isUndefined(entry.active) || entry.active),
      });
      const shape = getShape(legendEntriesShape || entry.shape || "square");

      // if the entry has a custom fill or stroke set, use it for both values
      let style = { ...entry.style };
      style.fill = style.fill ?? style.stroke;
      style.stroke = style.stroke ?? style.fill;

      return (
         <svg
            className={this.CSS.element(this.baseClass, "svg")}
            style={{
               width: `${this.svgSize}px`,
               height: `${this.svgSize}px`,
            }}
         >
            {shape(this.svgSize / 2, this.svgSize / 2, entry.shapeSize || this.shapeSize, {
               style,
               className,
            })}
         </svg>
      );
   }
}

Legend.prototype.name = "legend";
Legend.prototype.baseClass = "legend";
Legend.prototype.vertical = false;
Legend.prototype.memoize = false;
Legend.prototype.shapeSize = 18;
Legend.prototype.shape = null;
Legend.prototype.svgSize = 20;
Legend.prototype.showValues = false;
Legend.prototype.valueFormat = "s";

Widget.alias("legend", Legend);

interface LegendScopeInstance extends Instance {
   legends: Record<string, { entries: LegendEntryData[]; names: Record<string, LegendEntryData> }>;
}

Legend.Scope = class extends PureContainer {
   explore(context: RenderingContext, instance: LegendScopeInstance): void {
      context.push("legends", (instance.legends = {}));
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: LegendScopeInstance): void {
      context.pop("legends");
   }

   prepare(context: RenderingContext, instance: LegendScopeInstance): void {
      context.push("legends", instance.legends);
   }

   prepareCleanup(context: RenderingContext, instance: LegendScopeInstance): void {
      context.pop("legends");
   }
};

export const LegendScope = Legend.Scope;
