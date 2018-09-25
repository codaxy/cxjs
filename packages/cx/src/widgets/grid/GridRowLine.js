import {Container} from '../../ui/Container';
import {VDOM, Widget} from '../../ui/Widget';
import {GridCell} from "./GridCell";

export class GridRowLine extends Container {
   init() {
      this.items = Widget.create(GridCell, this.columns || [], {
         recordName: this.recordName
      });
      super.init();
   }

   render(context, instance, key) {
      let {data} = instance;
      return {
         key,
         data,
         content: this.renderChildren(context, instance),
         atomic: true
      };
   }
}

GridRowLine.prototype.styled = true;
