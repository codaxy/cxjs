import {Widget, VDOM} from '../../ui/Widget';

import FolderIcon from '../icons/folder';
import FolderOpenIcon from '../icons/folder-open';
import FileIcon from '../icons/file';
import LoadingIcon from '../icons/loading';
import DropdownIcon from '../icons/drop-down';

import {Icon} from '../Icon';

export class TreeNode extends Widget {

   declareData() {
      super.declareData({
         level: undefined,
         expanded: undefined,
         leaf: undefined,
         text: undefined,
         loading: undefined
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

      let icon;

      if (data.leaf)
         icon = FileIcon;
      else {
         if (data.loading)
            icon = LoadingIcon;
         else if (data.expanded)
            icon = FolderOpenIcon;
         else
            icon = FolderIcon;
      }

      return <div className={data.classNames} style={data.style}>
         <div className={CSS.element(baseClass, 'handle')} onClick={e => this.toggle(e, instance)}>
            { !data.leaf && <DropdownIcon className={CSS.element(baseClass, 'arrow')} /> }
            {
               icon({
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

Widget.alias('treenode', TreeNode);