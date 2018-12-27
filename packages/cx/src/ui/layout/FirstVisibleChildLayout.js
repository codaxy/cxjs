import {PureContainer} from "../PureContainer";

function isVisibleDeep(instance) {
   if (instance.visible && (!instance.widget.isPureContainer || !instance.widget.useParentLayout))
      return true;
   if (instance.children) {
      for (let i = 0; i < instance.children.length; i++)
         if (isVisibleDeep(instance.children[i]))
            return true;
   }
   return false;
}

class FirstVisibleChildItem extends PureContainer {

   checkVisible(context, instance, data) {
      if (instance.parent.firstVisibleChild)
         return false;
      return super.checkVisible(context, instance, data);
   }

   explore(context, instance) {
      if (instance.parent.firstVisibleChild)
         return;
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      if (instance.parent.firstVisibleChild)
         return;
      if (isVisibleDeep(instance))
         instance.parent.firstVisibleChild = instance;
   }

   render(context, instance, key) {
      if (instance.parent.firstVisibleChild != instance)
         return null;
      return super.render(context, instance, key)
   }
}

FirstVisibleChildItem.prototype.useParentLayout = true;

export class FirstVisibleChildLayout extends PureContainer {

   explore(context, instance) {
      instance.firstVisibleChild = null;
      for (let i = this.items.length - 1; i >= 0; i--) {
         let x = instance.getChild(context, this.items[i]);
         x.scheduleExploreIfVisible(context);
      }
   }

   exploreCleanup(context, instance) {
      let {children, firstVisibleChild} = instance;
      if (children) {
         for (let i = 0; i < children.length; i++)
            if (children[i] != firstVisibleChild)
               children[i].destroy();
      }
      instance.children = [];
      if (firstVisibleChild)
         instance.children.push(firstVisibleChild);
   }

   wrapItem(item) {
      return item instanceof FirstVisibleChildItem ? item : FirstVisibleChildItem.create({items: item});
   }
}