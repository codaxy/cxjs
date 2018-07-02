import {Widget, VDOM} from '../ui/Widget';
import {HtmlElement} from '../widgets/HtmlElement';
import {getShape} from './shapes';
import {Selection} from '../ui/selection/Selection';
import {stopPropagation} from '../util/eventCallbacks';
import {isUndefined} from '../util/isUndefined';

export class LegendEntry extends HtmlElement {

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
         size: undefined
      });
   }

   prepareData(context, instance) {
      let {data} = instance;

      if (data.name && !data.colorName)
         data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context, instance) {
      var {data} = instance;
      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName)
         instance.colorMap.acknowledge(data.colorName);
      super.explore(context, instance);
   }

   prepare(context, instance) {

      var {data, colorMap} = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache('colorIndex', data.colorIndex))
            instance.markShouldUpdate(context);
      }
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

      if (this.onClick && instance.invoke("onClick", e, instance) === false)
         return;

      e.stopPropagation();

      var any = this.legendAction == 'auto';

      if (any || this.legendAction == 'toggle')
         if (instance.set('active', !instance.data.active))
            return;

      if ((any || this.legendAction == 'select') && !this.selection.isDummy)
         this.selection.selectInstance(instance);
   }

   renderShape(instance) {
      var entry = instance.data;
      var className = this.CSS.element(this.baseClass, 'shape', {
         disabled: entry.disabled,
         selected: entry.selected || this.selection.isInstanceSelected(instance),
         [`color-${entry.colorIndex}`]: entry.colorIndex != null && (isUndefined(entry.active) || entry.active)
      });
      var shape = getShape(entry.shape || 'square');

      return <svg
         key="svg"
         className={this.CSS.element(this.baseClass, "svg")}
         style={{
            width: `${this.svgSize}px`,
            height: `${this.svgSize}px`,
            marginTop: `${-this.svgSize / 2}px`,
         }}
      >
         {
            shape(this.svgSize / 2, this.svgSize / 2, entry.size, {
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
LegendEntry.prototype.size = 18;
LegendEntry.prototype.svgSize = 20;

Widget.alias('legend-entry', LegendEntry);