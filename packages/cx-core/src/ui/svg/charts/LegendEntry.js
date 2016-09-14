import {Widget, VDOM} from '../../Widget';
import {HtmlElement} from '../../HtmlElement';
import {getShape} from './shapes';
import {Selection} from '../../selection/Selection';
import {stopPropagation} from '../../eventCallbacks';

export class LegendEntry extends HtmlElement {
   declareData() {

      var selection = this.selection.configureWidget(this);

      super.declareData(...arguments, selection, {
         selected: undefined,
         shape: undefined,
         colorIndex: undefined,
         colorMap: undefined,
         name: undefined,
         active: true,
      });
   }

   init() {
      this.selection = Selection.create(this.selection);
      super.init();
   }

   explore(context, instance) {
      var {data} = instance;
      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.name)
         instance.colorMap.acknowledge(data.name);
      super.explore(context, instance);
   }

   prepare(context, instance) {

      var {data, colorMap} = instance;

      if (colorMap && data.name) {
         data.colorIndex = colorMap.map(data.name);
         if (instance.colorIndex != data.colorIndex) {
            instance.colorIndex = data.colorIndex;
            instance.shouldUpdate = true;
         }
      }

      super.prepare(context, instance);
   }

   attachProps(context, instance, props) {
      var shape = this.renderShape(instance);
      props.children = [shape, props.children];
      props.onMouseDown = stopPropagation;
      props.onClick = e => { this.handleClick(e, instance) };

      delete props.active;
      delete props.selection;
      delete props.colorMap;
      delete props.colorIndex;
      delete props.shape;
      delete props.name;
      delete props.selected;
   }

   handleClick(e, instance) {

      if (this.onClick && this.onClick(e, instance) === false)
         return;

      e.stopPropagation();

      var any = this.legendAction == 'auto';

      if (any || this.legendAction == 'toggle')
         if (instance.set('active', !instance.data.active))
            return;

      if (any || this.legendAction == 'select')
         this.selection.selectInstance(instance);
   }

   renderShape(instance) {
      var entry = instance.data;
      var className = this.CSS.element(this.baseClass, 'shape', {
         disabled: entry.disabled,
         selected: entry.selected || this.selection.isInstanceSelected(instance),
         [`color-${entry.colorIndex}`]: entry.colorIndex != null && (typeof entry.active == 'undefined' || entry.active)
      });
      var shape = getShape(entry.shape || 'square');

      return <svg key="svg" className={this.CSS.element(this.baseClass, "svg")}>
         {
            shape(10, 10, 18, {
               style: entry.style,
               className: className
            })
         }
      </svg>
   }
}

LegendEntry.prototype.baseClass = "legendentry";
LegendEntry.prototype.shape = "square";
LegendEntry.prototype.legendAction = "auto";

Widget.alias('legend-entry', LegendEntry);