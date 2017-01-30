import { SubscriberList } from '../../util/SubscriberList';
import { getCursorPos } from '../overlay/captureMouse';
import { startAppLoop } from '../../ui/app/startAppLoop';

let dropZones = new SubscriberList(),
   activeZone,
   nearZones,
   puppet;

export class DragDropManager {
   static registerDropZone(dropZone) {
      return dropZones.subscribe(dropZone);
   }

   static notifyDragStart(e, options = {}) {

      let sourceEl = options.sourceEl || e.target;
      let sourceBounds = sourceEl.getBoundingClientRect();
      let cursor = getCursorPos(e);

      let clone = document.createElement('div');
      clone.className = "cxb-dragclone";
      clone.style.left = `-1000px`;
      clone.style.top = `-1000px`;
      clone.style.minWidth = `${Math.ceil(sourceBounds.width)}px`;
      clone.style.minHeight = `${Math.ceil(sourceBounds.height)}px`;
      document.body.appendChild(clone);

      let styles = getComputedStyle(sourceEl);

      let source = {
         ...options.source,
         margin: [
            styles.getPropertyValue('margin-top'),
            styles.getPropertyValue('margin-right'),
            styles.getPropertyValue('margin-bottom'),
            styles.getPropertyValue('margin-left'),
         ]
      };

      puppet = {
         deltaX: cursor.clientX - sourceBounds.left,
         deltaY: cursor.clientY - sourceBounds.top,
         el: clone,
         source
      };

      if (source.widget && source.store) {
         puppet.stop = startAppLoop(clone, source.store, source.widget);
      }

      let event = getDragEvent(e, 'dragstart');
      dropZones.execute(zone => {

         if (zone.onDragTest && !zone.onDragTest(event))
            return;

         if (zone.onDragStart)
            zone.onDragStart(event);
      });

      this.notifyDragMove(e);
   }

   static notifyDragMove(e) {

      let cursor = getCursorPos(e);
      puppet.el.style.left = `${cursor.clientX - puppet.deltaX}px`;
      puppet.el.style.top = `${cursor.clientY - puppet.deltaY}px`;

      //return a score and call dragOver over the best match
      let event = getDragEvent(e, 'dragmove');
      let over = null,
         best = null;

      let near = [], away = [];

      dropZones.execute(zone => {
         if (zone.onDragTest && !zone.onDragTest(event))
            return;

         if (zone.onDragMeasure) {
            let result = zone.onDragMeasure(event) || {};
            if (result.near)
               near.push(zone);
            else
               away.push(zone);

            if (result.over > 0 && (best == null || result.over > best)) {
               over = zone;
               best = result.over;
            }
         }
      });

      let newNear = new WeakMap();

      if (nearZones != null) {
         away.forEach(z => {
            if (z.onDragAway && nearZones[z])
               z.onDragAway(z);
         });
      }

      near.forEach(z => {
         if (z.onDragNear && z != over && (nearZones == null || !nearZones[z])) {
            z.onDragNear(z);
            newNear[z] = true;
         }
      });

      nearZones = newNear;

      if (over != activeZone && activeZone && activeZone.onDragLeave)
         activeZone.onDragLeave(event);

      if (over != activeZone && over && over.onDragEnter)
         over.onDragEnter(event);

      activeZone = over;

      if (over && over.onDragOver) {
         over.onDragOver(event);
      }
   }

   static notifyDragDrop(e) {
      let event = getDragEvent(e, 'dragdrop');

      if (puppet.stop)
         puppet.stop();

      document.body.removeChild(puppet.el);

      if (activeZone && activeZone.onDragDrop)
         activeZone.onDragDrop(event);

      dropZones.execute(zone => {

         if (zone.onDragTest && !zone.onDragTest(event))
            return;

         if (nearZones != null && zone.onDragAway && nearZones[zone])
            zone.onDragAway(e);

         if (zone.onDragEnd)
            zone.onDragEnd(event);
      });

      nearZones = null;
      activeZone = null;
      puppet = null;
   }
}

function getDragEvent(e, type) {

   let r = puppet.el.getBoundingClientRect();

   let bounds = {
      left: r.left,
      right: r.right,
      top: r.top,
      bottom: r.bottom
   };

   if (puppet.margin) {
      bounds.left -= puppet.margin;
      bounds.top -= puppet.margin;
      bounds.right += puppet.margin;
      bounds.bottom += puppet.margin;
   }

   return {
      eventType: type,
      event: e,
      cursor: getCursorPos(e),
      itemBounds: bounds,
      data: puppet.source.data,
      store: puppet.source.store,
      source: puppet.source
   }
}
