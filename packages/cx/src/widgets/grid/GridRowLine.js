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
      return <tr
         key={key}
         className={data.classNames}
         style={data.style}
      >
         {this.renderChildren(context, instance)}
      </tr>
   }
}

GridRowLine.prototype.styled = true;
