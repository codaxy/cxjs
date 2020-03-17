import { PureContainer } from "../../ui/PureContainer";
import { Format } from "../../ui/Format";
import { VDOM } from "../../ui/Widget";
import { isUndefined } from "../../util/isUndefined";

export class GridCell extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         value: undefined,
         aggregateValue: undefined,
         weight: undefined,
         pad: undefined,
         format: undefined,
         colSpan: undefined,
         rowSpan: undefined,
         editable: undefined,
         fixed: undefined
      });
   }

   init() {
      if (!this.value && this.field)
         this.value = { bind: this.recordName + "." + this.field };

      if (isUndefined(this.editable)) this.editable = !!this.editor;

      super.init();
   }

   prepareCSS(context, instance) {
      let { data } = instance;

      data.classNames = this.CSS.expand(
         data.className,
         data.class,
         this.CSS.state({
            pad: data.pad,
            editable: data.editable,
            ["aligned-" + this.align]: this.align
         })
      );

      data.style = this.CSS.parseStyle(data.style);
   }

   render(context, instance, key) {
      let { data } = instance;
      let content;

      if (this.items.length > 0)
         content = this.renderChildren(context, instance);
      else {
         content = data.value;
         if (data.format) content = Format.value(content, data.format);
      }

      return {
         atomic: true,
         content,
         instance,
         data,
         key,
         uniqueColumnId: this.uniqueColumnId
      };
   }
}

GridCell.prototype.pad = true;
GridCell.prototype.styled = true;
GridCell.prototype.fixed = false;
