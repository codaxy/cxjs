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

      let sourceEl = e.target || options.sourceEl;
      let sourceBounds = sourceEl.getBoundingClientRect();
      let cursor = getCursorPos(e);

      let clone = document.createElement('div');
      clone.className = "cxb-dragclone";
      clone.style.left = `-1000px`;
      clone.style.top = `-1000px`;
      clone.style.width = `${sourceBounds.width}px`;
      clone.style.height = `${sourceBounds.height}px`;
      document.body.appendChild(clone);

      let source = options.source || {};

      puppet = {
         deltaX: cursor.clientX - sourceBounds.left,
         deltaY: cursor.clientY - sourceBounds.top,
         el: clone,
         source,
         margin: options.puppetMargin
      };

      if (source.widget && source.store) {
         puppet.stop = startAppLoop(clone, source.store, source.widget);
      }

      let event = getDragEvent(e, 'dragstart');
      dropZones.execute(zone => {
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
         if (zone.onDragTest) {
            let result = zone.onDragTest(event) || {};
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

      if (activeZone && activeZone.onDragDrop)
         activeZone.onDragDrop(event);

      dropZones.execute(zone => {

         if (nearZones != null && zone.onDragAway && nearZones[zone])
            zone.onDragAway(e);

         if (zone.onDragEnd)
            zone.onDragEnd(event);
      });

      if (puppet.stop)
         puppet.stop();

      document.body.removeChild(puppet.el);
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
      data: puppet.source.data
   }
}
