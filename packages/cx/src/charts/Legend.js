import { Widget, VDOM } from "../ui/Widget";
import { HtmlElement } from "../widgets/HtmlElement";
import { PureContainer } from "../ui/PureContainer";
import { getShape } from "./shapes";
import { isUndefined } from "../util/isUndefined";
import { isNonEmptyArray } from "../util/isNonEmptyArray";
import { parseStyle } from "../util/parseStyle";
import { withHoverSync } from "../ui/HoverSync";

export class Legend extends HtmlElement {
   declareData() {
      super.declareData(...arguments, {
         shape: undefined,
         entryStyle: { structured: true },
         entryClass: { structured: true },
      });
   }

   init() {
      this.entryStyle = parseStyle(this.entryStyle);
      super.init();
   }

   prepareData(context, instance) {
      let { data } = instance;
      data.stateMods = Object.assign(data.stateMods || {}, {
         vertical: this.vertical,
      });
      super.prepareData(context, instance);
   }

   isValidHtmlAttribute(attrName) {
      switch (attrName) {
         case "shapeSize":
         case "svgSize":
         case "shape":
         case "entryStyle":
         case "entryClass":
            return false;

         default:
            return super.isValidHtmlAttribute(attrName);
      }
   }

   explore(context, instance) {
      if (!context.legends) context.legends = {};

      instance.legends = context.legends;

      context.addLegendEntry = (legendName, entry) => {
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

   renderChildren(context, instance) {
      const CSS = this.CSS;

      let entries = instance.legends[this.name] && instance.legends[this.name].entries,
         list;

      let { entryClass, entryStyle, shape } = instance.data;

      if (isNonEmptyArray(entries)) {
         list = entries.map((e, i) =>
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
                  onClick={e.onClick}
                  onMouseMove={onMouseMove}
                  onMouseLeave={onMouseLeave}
               >
                  {this.renderShape(e, shape)}
                  <div>{e.displayText || e.name}</div>
               </div>
            )),
         );
      }

      return [list, super.renderChildren(context, instance)];
   }

   renderShape(entry, legendEntriesShape) {
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

Widget.alias("legend", Legend);

Legend.Scope = class extends PureContainer {
   explore(context, instance) {
      context.push("legends", (instance.legends = {}));
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop("legends");
   }

   prepare(context, instance) {
      context.push("legends", instance.legends);
   }

   prepareCleanup(context, instance) {
      context.pop("legends");
   }
};

export const LegendScope = Legend.Scope;
