import {Widget, VDOM} from '../ui/Widget';
import {HtmlElement} from '../widgets/HtmlElement';
import {PureContainer} from '../ui/PureContainer';
import {getShape} from './shapes';
import {isUndefined} from '../util/isUndefined';
import {isArray} from '../util/isArray';

export class Legend extends HtmlElement {

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = Object.assign(data.stateMods || {}, {
         vertical: this.vertical
      });
      super.prepareData(context, instance);
   }

   isValidHtmlAttribute(attrName) {
      switch (attrName) {
         case 'shapeSize':
            return false;

         default:
            return super.isValidHtmlAttribute(attrName);
      }
   }

   explore(context, instance) {
      if (!context.legends)
         context.legends = {};

      instance.legends = context.legends;

      context.addLegendEntry = (legendName, entry) => {

         //case when all legends are scoped and new entry is added outside the scope
         if (!context.legends)
            return;

         let legend = context.legends[legendName];
         if (!legend)
            legend = context.legends[legendName] = {
               entries: [],
               names: {}
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

      if (isArray(entries) && entries.length > 0) {
         list = <div key="wrap" className={CSS.element(this.baseClass, "wrap")}>
            {entries.map((e, i) => {
               return <div
                  key={i}
                  className={CSS.element(this.baseClass, "entry")}
                  onClick={e.onClick}>
                  {this.renderShape(e)}
                  {e.name}
               </div>
            })}
         </div>
      }

      return [
         list,
         super.renderChildren(context, instance)
      ]
   }

   renderShape(entry) {
      const className = this.CSS.element(this.baseClass, 'shape', {
         disabled: entry.disabled,
         selected: entry.selected,
         [`color-${entry.colorIndex}`]: entry.colorIndex != null && (isUndefined(entry.active) || entry.active)
      });
      const shape = getShape(entry.shape || 'square');

      return <svg
         className={this.CSS.element(this.baseClass, "svg")}
         style={{
            width: `${this.svgSize}px`,
            height: `${this.svgSize}px`,
            marginTop: `${-this.svgSize/2}px`,
         }}
      >
         {
            shape(this.svgSize / 2, this.svgSize / 2, entry.shapeSize || this.shapeSize, {
               style: entry.style,
               className: className
            })
         }
      </svg>
   }
}

Legend.prototype.name = 'legend';
Legend.prototype.baseClass = 'legend';
Legend.prototype.vertical = false;
Legend.prototype.memoize = false;
Legend.prototype.shapeSize = 18;
Legend.prototype.svgSize = 20;

Widget.alias('legend', Legend);

Legend.Scope = class extends PureContainer {
   explore(context, instance) {
      context.push('legends', instance.legends = {});
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('legends');
   }

   prepare(context, instance) {
      context.push('legends', instance.legends);
   }

   prepareCleanup(context, instance) {
      context.pop('legends');
   }
};



