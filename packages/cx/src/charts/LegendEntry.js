import { Widget, VDOM } from "../ui/Widget";
import { getShape } from "./shapes";
import { Selection } from "../ui/selection/Selection";
import { stopPropagation } from "../util/eventCallbacks";
import { isUndefined } from "../util/isUndefined";
import { Container } from "../ui/Container";

export class LegendEntry extends Container {
   init() {
      this.selection = Selection.create(this.selection);
      super.init();
   }

   declareData() {
      var selection = this.selection.configureWidget(this);

      super.declareData(...arguments, selection, {
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

   prepareData(context, instance) {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context, instance) {
      var { data } = instance;
      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);
      super.explore(context, instance);
   }

   prepare(context, instance) {
      var { data, colorMap } = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }
   }

   handleClick(e, instance) {
      if (this.onClick && instance.invoke("onClick", e, instance) === false) return;

      e.stopPropagation();

      var any = this.legendAction == "auto";

      if (any || this.legendAction == "toggle") if (instance.set("active", !instance.data.active)) return;

      if ((any || this.legendAction == "select") && !this.selection.isDummy) this.selection.selectInstance(instance);
   }

   render(context, instance, key) {
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

   renderShape(instance) {
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
