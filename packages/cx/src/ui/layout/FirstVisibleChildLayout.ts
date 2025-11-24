import { Instance } from "../Instance";
import { PureContainer } from "../PureContainer";
import { RenderingContext } from "../RenderingContext";

function isVisibleDeep(instance: Instance): boolean {
   if (instance.visible && (!instance.widget.isPureContainer || !(instance.widget as any).useParentLayout)) return true;
   if (instance.children) {
      for (let i = 0; i < instance.children.length; i++) if (isVisibleDeep(instance.children[i])) return true;
   }
   return false;
}

class FirstVisibleChildItem extends PureContainer {
   checkVisible(context: RenderingContext, instance: any, data: any): boolean {
      if (instance.parent.firstVisibleChild) return false;
      return super.checkVisible(context, instance, data);
   }

   explore(context: RenderingContext, instance: any): void {
      if (instance.parent.firstVisibleChild) return;
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: any): void {
      if (instance.parent.firstVisibleChild) return;
      if (isVisibleDeep(instance)) instance.parent.firstVisibleChild = instance;
   }

   render(context: RenderingContext, instance: any, key: any): any {
      if (instance.parent.firstVisibleChild != instance) return null;
      return super.render(context, instance, key);
   }
}

FirstVisibleChildItem.prototype.useParentLayout = true;

export class FirstVisibleChildLayout extends PureContainer {
   explore(context: RenderingContext, instance: any): void {
      instance.firstVisibleChild = null;
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: any): void {
      let { children, firstVisibleChild } = instance;
      if (children) {
         for (let i = 0; i < children.length; i++) if (children[i] != firstVisibleChild) children[i].destroy();
      }
      instance.children = [];
      if (firstVisibleChild) instance.children.push(firstVisibleChild);
   }

   wrapItem(item: any): any {
      return item instanceof FirstVisibleChildItem ? item : FirstVisibleChildItem.create({ items: item });
   }
}
