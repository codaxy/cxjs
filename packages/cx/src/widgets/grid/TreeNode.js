import {Widget, VDOM} from '../../ui/Widget';
import {Icon} from '../Icon';
import DropdownIcon from '../icons/drop-down';

export class TreeNode extends Widget {

   init() {
      if (this.itemIcon)
         this.leafIcon = this.itemIcon;
      super.init();
   }

   declareData() {
      super.declareData({
         level: undefined,
         expanded: undefined,
         leaf: undefined,
         text: undefined,
         loading: undefined,
         icon: undefined,
         leafIcon: undefined,
         openFolderIcon: undefined,
         folderIcon: undefined
      }, ...arguments);
   }

   prepareData(context, instance) {
      var {data} = instance;
      data.stateMods = {
         expanded: data.expanded,
         loading: data.loading,
         leaf: data.leaf,
         folder: !data.leaf,
         icon: !this.hideIcon
      };
      data.stateMods[`level-${data.level}`] = true;
      super.prepareData(context, instance);
   }

   render(context, instance, key) {
      var {data, widget} = instance;
      var {CSS, baseClass} = widget;

      let icon = data.icon;

      if (!data.icon) {
         if (data.leaf)
            icon = data.leafIcon;
         else {
            if (data.loading)
               icon = this.loadingIcon;
            else if (data.expanded)
               icon = data.openFolderIcon || data.folderIcon;
            else
               icon = data.folderIcon;
         }
      }

      let arrowIcon = this.arrowIcon;
      if (this.hideIcon && data.loading)
         arrowIcon = this.loadingIcon;

      return <div key={key} className={data.classNames} style={data.style}>
         <div className={CSS.element(baseClass, 'handle')} onClick={e => this.toggle(e, instance)}>
            { !data.leaf && Icon.render(arrowIcon, { className: CSS.element(baseClass, 'arrow')}) }
            {
               !this.hideIcon && Icon.render(icon, {
                  className: CSS.element(baseClass, 'icon')
               })
            }
         </div>
         <div>
            {data.text}
         </div>
      </div>;
   }

   toggle(e, instance) {
      var {data} = instance;
      if (!data.leaf)
         instance.set('expanded', !data.expanded);
      e.preventDefault();
      e.stopPropagation();
   }
}

TreeNode.prototype.baseClass = 'treenode';
TreeNode.prototype.itemIcon = 'file';
TreeNode.prototype.loadingIcon = 'loading';
TreeNode.prototype.folderIcon = 'folder';
TreeNode.prototype.openFolderIcon = 'folder-open';
TreeNode.prototype.arrowIcon = 'drop-down';
TreeNode.prototype.styled = true;
TreeNode.prototype.hideIcon = false;

Widget.alias('treenode', TreeNode);