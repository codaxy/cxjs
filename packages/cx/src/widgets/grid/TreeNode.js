import {Widget, VDOM} from '../../ui/Widget';
import {Icon} from '../Icon';
import DropdownIcon from '../icons/drop-down';

export class TreeNode extends Widget {

   declareData() {
      super.declareData({
         level: undefined,
         expanded: undefined,
         leaf: undefined,
         text: undefined,
         loading: undefined,
         icon: undefined,

      }, ...arguments);
   }

   prepareData(context, instance) {
      var {data} = instance;
      data.stateMods = {
         expanded: data.expanded,
         loading: data.loading,
         leaf: data.leaf,
         folder: !data.leaf
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
            icon = this.itemIcon;
         else {
            if (data.loading)
               icon = this.loadingIcon;
            else if (data.expanded)
               icon = this.openFolderIcon || this.folderIcon;
            else
               icon = this.folderIcon;
         }
      }

      return <div key={key} className={data.classNames} style={data.style}>
         <div className={CSS.element(baseClass, 'handle')} onClick={e => this.toggle(e, instance)}>
            { !data.leaf && <DropdownIcon className={CSS.element(baseClass, 'arrow')} /> }
            {
               Icon.render(icon, {
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
TreeNode.prototype.styled = true;

Widget.alias('treenode', TreeNode);