import {PureContainer} from '../../ui/PureContainer';
import {Format} from '../../ui/Format';
import {VDOM} from '../../ui/Widget';

export class GridCell extends PureContainer {

   declareData() {
      return super.declareData(...arguments, {
         value: undefined,
         weight: undefined,
         pad: undefined,
         format: undefined
      })
   }

   init() {
      if (!this.value && this.field)
         this.value = {bind: this.recordName + '.' + this.field};
      super.init();
   }

   prepareCSS(context, instance) {
      let {data} = instance;

      data.classNames = this.CSS.expand(data.className, data.class, this.CSS.state({
         pad: data.pad,
         ['aligned-' + this.align]: this.align
      }));

      data.style = this.CSS.parseStyle(data.style);
   }

   render(context, instance, key) {
      let {data} = instance;
      let v = this.renderChildren(context, instance);

      if (v.length == 0) {
         v = data.value;
         if (data.format)
            v = Format.value(v, data.format);
      }

      return (
         <td
            key={key}
            className={data.classNames}
            style={data.style}
         >
            {v}
         </td>
      )
   }
}

GridCell.prototype.pad = true;
GridCell.prototype.styled = true;
