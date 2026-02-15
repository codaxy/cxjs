/** @jsxImportSource react */
import { Widget, VDOM } from "../../ui/Widget";
import { Icon } from "../Icon";
import { stopPropagation } from "../../util/eventCallbacks";
import { ContainerBase, StyledContainerConfig } from "../../ui/Container";
import { BooleanProp, NumberProp, StringProp } from "../../ui/Prop";
import { Instance } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";

export interface TreeNodeConfig extends StyledContainerConfig {
  /** Indentation level of the node. */
  level?: NumberProp;

  /** Set to `true` if the node is expanded. */
  expanded?: BooleanProp;

  /** Set to `true` if the node is a leaf (has no children). */
  leaf?: BooleanProp;

  /** Text to be displayed. */
  text?: StringProp;

  /** Set to `true` if the node is loading. */
  loading?: BooleanProp;

  /** Icon to be displayed. */
  icon?: StringProp;

  /** Icon for items (sets leafIcon). */
  itemIcon?: StringProp;

  /** Icon for leaf nodes. */
  leafIcon?: StringProp;

  /** Icon displayed when the node is loading. */
  loadingIcon?: string;

  /** Icon for open folder. */
  openFolderIcon?: StringProp;

  /** Icon for folder. */
  folderIcon?: StringProp;

  /** Set to `true` to hide the icon. */
  hideIcon?: boolean;

  /** Set to `true` to hide the arrow. */
  hideArrow?: BooleanProp;
}

export class TreeNode extends ContainerBase<TreeNodeConfig> {
  declare baseClass: string;
  declare itemIcon: string;
  declare leafIcon: string;
  declare loadingIcon: string;
  declare folderIcon: string;
  declare openFolderIcon: string;
  declare arrowIcon: string;
  declare hideIcon: boolean;

  constructor(config?: TreeNodeConfig) {
    super(config);
  }

  init() {
    if (this.itemIcon) this.leafIcon = this.itemIcon;
    super.init();
  }

  declareData() {
    super.declareData(
      {
        level: undefined,
        expanded: undefined,
        leaf: undefined,
        text: undefined,
        loading: undefined,
        icon: undefined,
        leafIcon: undefined,
        openFolderIcon: undefined,
        folderIcon: undefined,
        hideArrow: undefined,
      },
      ...arguments,
    );
  }

  prepareData(context: RenderingContext, instance: Instance) {
    let { data } = instance;
    data.stateMods = {
      expanded: data.expanded,
      loading: data.loading,
      leaf: data.leaf,
      folder: !data.leaf,
      icon: !this.hideIcon,
    };
    data.stateMods[`level-${data.level}`] = true;
    super.prepareData(context, instance);
  }

  render(context: RenderingContext, instance: Instance, key: string) {
    let { data } = instance;
    let { CSS, baseClass } = this;

    let icon = data.icon;

    if (!data.icon) {
      if (data.leaf) icon = data.leafIcon;
      else {
        if (data.loading) icon = this.loadingIcon;
        else if (data.expanded) icon = data.openFolderIcon || data.folderIcon;
        else icon = data.folderIcon;
      }
    }

    let arrowIcon = this.arrowIcon;
    if (this.hideIcon && data.loading) arrowIcon = this.loadingIcon;

    return (
      <div key={key} className={data.classNames} style={data.style}>
        <div
          className={CSS.element(baseClass, "handle")}
          onClick={(e) => this.toggle(e, instance)}
          onMouseDown={
            !this.hideIcon && !data.leaf
              ? (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }
              : undefined
          }
        >
          {!data.leaf &&
            !data.hideArrow &&
            Icon.render(arrowIcon, {
              className: CSS.element(baseClass, "arrow"),
            })}
          {!this.hideIcon &&
            Icon.render(icon, {
              className: CSS.element(baseClass, "icon"),
            })}
        </div>
        <div>{data.text || this.renderChildren(context, instance)}</div>
      </div>
    );
  }

  toggle(e: React.MouseEvent, instance: Instance) {
    let { data } = instance;
    if (!data.leaf) instance.set("expanded", !data.expanded);
    e.preventDefault();
    e.stopPropagation();
  }
}

TreeNode.prototype.baseClass = "treenode";
TreeNode.prototype.itemIcon = "file";
TreeNode.prototype.loadingIcon = "loading";
TreeNode.prototype.folderIcon = "folder";
TreeNode.prototype.openFolderIcon = "folder-open";
TreeNode.prototype.arrowIcon = "drop-down";
TreeNode.prototype.styled = true;
TreeNode.prototype.hideIcon = false;

Widget.alias("treenode", TreeNode);
