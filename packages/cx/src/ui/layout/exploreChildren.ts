import { CxChild, RenderingContext } from "../RenderingContext";
import { Instance } from "../Instance";
import { View } from "../../data/View";
import type { InstanceBase } from "../InstanceBase";
import type { Widget } from "../Widget";
import { acquireSharedInstance, exploreChildState, releaseSharedInstance, sharesInstance } from "../SharedInstance";

let childStateRevision = 0;

export function exploreChildren(
   context: RenderingContext,
   instance: Instance,
   children: CxChild[],
   previousResult: any[] | null,
   key: any,
   store: View,
): any[] {
   let newChildren = previousResult || [];
   let oldChildren = previousResult || newChildren;
   let identical = previousResult ? 0 : -1;
   let sharedInstance: Instance | null = null;
   let statesChanged = false;

   try {
      for (let c = 0; c < children.length; c++) {
         // the items of containers, initialized widgets by now
         let widget = children[c] as Widget;
         let cell: InstanceBase;

         if (sharesInstance(widget)) {
            // updated and rendered right away, through the shared instance
            let state = instance.getInstanceCache().getState(widget, store, key);
            if (!sharedInstance) sharedInstance = acquireSharedInstance(instance, store);
            if (exploreChildState(context, sharedInstance, state)) statesChanged = true;
            if (!state.visible) continue;
            instance.getInstanceCache().addChild(state);
            cell = state;
         } else {
            let child = instance.getChild(context, widget, key, store);
            if (!child.checkVisible(context)) continue;
            context.exploreStack.push(child);
            if (child.needsExploreCleanup) context.exploreStack.push(child);
            cell = child;
         }

         if (identical >= 0) {
            if (cell == oldChildren[identical]) identical++;
            else {
               newChildren = newChildren.slice(0, identical);
               identical = -1;
               newChildren.push(cell);
            }
         } else newChildren.push(cell);
      }
   } finally {
      if (sharedInstance) releaseSharedInstance(sharedInstance);
   }

   if (identical >= 0 && identical != newChildren.length) newChildren = newChildren.slice(0, identical);

   if (sharedInstance) {
      // Changes of children without instances are reported through the parent's cache, which is updated when the
      // parent renders, as instances compare their data with their own cache. An explore pass that is repeated
      // before rendering, after the store changed during explore (see Cx), thus reports them again.
      if (statesChanged) instance.childStateRevision = ++childStateRevision;
      if (instance.cache("childStateRevision", instance.childStateRevision)) instance.markShouldUpdate(context);
   }

   return newChildren;
}
