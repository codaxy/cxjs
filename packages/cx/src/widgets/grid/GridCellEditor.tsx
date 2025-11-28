/** @jsxImportSource react */
import { ContainerBase, StyledContainerConfig } from "../../ui/Container";
import { VDOM } from "../../ui/VDOM";
import { findFirstChild, isFocusable, isFocusedDeep } from "../../util/DOM";
import { Instance } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";

export interface GridCellEditorConfig extends StyledContainerConfig {}

export class GridCellEditor extends ContainerBase<GridCellEditorConfig> {
   constructor(config?: GridCellEditorConfig) {
      super(config);
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      let { data } = instance;
      return (
         <GridCellEditorCmp key={key} className={data.className} style={data.style}>
            {this.renderChildren(context, instance)}
         </GridCellEditorCmp>
      );
   }
}

GridCellEditor.prototype.styled = true;

interface GridCellEditorCmpProps {
   className?: string;
   style?: React.CSSProperties;
   children?: React.ReactNode;
}

class GridCellEditorCmp extends VDOM.Component<GridCellEditorCmpProps> {
   el: HTMLDivElement | null = null;

   render() {
      let { className, style, children } = this.props;

      return (
         <div ref={(el) => (this.el = el)} className={className} style={style}>
            {children}
         </div>
      );
   }

   componentDidMount() {
      if (!isFocusedDeep(this.el!)) {
         let focusableChild = findFirstChild(this.el!, isFocusable);
         if (focusableChild) focusableChild.focus();
      }
   }
}
