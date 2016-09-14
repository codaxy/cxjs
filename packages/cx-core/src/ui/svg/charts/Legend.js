import {Widget, VDOM} from '../../Widget';
import {HtmlElement} from '../../HtmlElement';
import {PureContainer} from '../../PureContainer';
import {getShape} from './shapes';

export class Legend extends HtmlElement {

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = Object.assign(data.stateMods || {}, {
         vertical: this.vertical
      });
      super.prepareData(context, instance);
   }

   explore(context, instance) {
      if (!context.legends)
         context.legends = {};

      instance.legends = context.legends;

      context.addLegendEntry = (legendName, entry) => {

         //case when all legends are scoped and new entry is added outside the scope
         if (!context.legends)
            return;

         var legend = context.legends[legendName];
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

      var CSS = this.CSS;

      var entries = instance.legends[this.name] && instance.legends[this.name].entries,
         list;

      if (Array.isArray(entries) && entries.length > 0) {
         list = <div key="wrap" className={CSS.element(this.baseClass, "wrap")}>
            { entries.map((e, i) => {
               return <div key={i}
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
      var className = this.CSS.element(this.baseClass, 'shape', {
         disabled: entry.disabled,
         selected: entry.selected,
         [`color-${entry.colorIndex}`]: entry.colorIndex != null && (typeof entry.active == 'undefined' || entry.active)
      });
      var shape = getShape(entry.shape || 'square');

      return <svg className={this.CSS.element(this.baseClass, "svg")}>
         {
            shape(10, 10, 18, {
               style: entry.style,
               className: className
            })
         }
      </svg>
   }
}

Legend.prototype.name = 'legend';
Legend.prototype.baseClass = 'legend';
Legend.prototype.pure = false;
Legend.prototype.vertical = false;
Legend.prototype.memoize = false;

Widget.alias('legend', Legend);

Legend.Scope = class extends PureContainer {
   explore(context, instance) {
      var previous = context.legends;
      instance.legends = context.legends = {};
      super.explore(context, instance);
      context.legends = previous;
   }

   prepare(context, instance) {
      var previous = context.legends;
      context.legends = instance.legends;
      super.prepare(context, instance);
      context.legends = previous;
   }
};



