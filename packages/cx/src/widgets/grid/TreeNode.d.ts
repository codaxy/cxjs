import * as Cx from "../../core";

interface TreeNodeProps extends Cx.WidgetProps {
   level?: Cx.NumberProp;
   expanded?: Cx.BooleanProp;
   leaf?: Cx.BooleanProp;
   text?: Cx.StringProp;
   loading?: Cx.BooleanProp;
   icon?: Cx.StringProp;

   itemIcon?: Cx.StringProp;
   leafIcon?: Cx.StringProp;
   loadingIcon?: string;
   folderIcon?: Cx.StringProp;
   openFolderIcon?: Cx.StringProp;

   /** Base CSS class to be applied to the element. Defaults to 'treenode'. */
   baseClass?: string;
   hideIcon?: boolean;
   hideArrow?: Cx.BooleanProp;
}

export class TreeNode extends Cx.Widget<TreeNodeProps> {}
