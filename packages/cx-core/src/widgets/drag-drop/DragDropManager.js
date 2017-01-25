import { SubscriberList } from '../../util/SubscriberList';
import { captureMouseOrTouch, getCursorPos } from '../overlay/captureMouse';

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
      clone.className = "cxe-dragsource-puppet";
      clone.style.left = `-1000px`;
      clone.style.top = `-1000px`;
      clone.style.width = `${sourceBounds.width}px`;
      clone.style.height = `${sourceBounds.height}px`;
      document.body.appendChild(clone);

      puppet = {
         deltaX: cursor.clientX - sourceBounds.left,
         deltaY: cursor.clientY - sourceBounds.top,
         el: clone
      };

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
            let [state, score] = normalizeDragTestResult(zone.onDragTest(event));
            if (state == 'near' || state == 'over')
               near.push(zone);
            else
               away.push(zone);

            if (state == 'over' && (best == null || score > best)) {
               over = zone;
               best = score;
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

      document.body.removeChild(puppet.el);
      nearZones = null;
      activeZone = null;
      puppet = null;
   }
}

function getDragEvent(e, type) {
   return {
      eventType: type,
      event: e,
      cursor: getCursorPos(e)
   }
}

function normalizeDragTestResult(x) {
   if (typeof x == 'string')
      return [x, 10000];
   if (Array.isArray(x))
      return x;
   return false;
}