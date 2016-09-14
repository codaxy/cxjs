import {Widget, VDOM} from '../Widget';

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
      return <div className={data.classNames} style={data.style}>
         <div className={CSS.element(baseClass, 'handle')} onClick={e=>this.toggle(e, instance)}>
            <div></div>
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