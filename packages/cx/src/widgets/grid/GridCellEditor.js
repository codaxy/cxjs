import {Container} from "../../ui/Container";
import { VDOM} from "../../ui/VDOM";
import {findFirstChild, isFocusable, isFocusedDeep} from "../../util/DOM";
import {getActiveElement} from "../../util/getActiveElement";

export class GridCellEditor extends Container {
   render(context, instance, key) {
      let {data} = instance;
      return <GridCellEditorCmp
         key={key}
         className={data.className}
         style={data.style}
      >
         {this.renderChildren(context, instance)}
      </GridCellEditorCmp>
   }
}

GridCellEditor.prototype.styled = true;

class GridCellEditorCmp extends VDOM.Component {
   render() {
      let {className, style, children} = this.props;

      return <div
         ref={el => this.el = el}
         className={className}
         style={style}
      >
         {children}
      </div>
   }

   componentDidMount() {
      if (!isFocusedDeep(this.el)) {
         let focusableChild = findFirstChild(this.el, isFocusable);
         if (focusableChild)
            focusableChild.focus();
      }
   }
}
