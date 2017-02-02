import {SubscriberList} from '../../util/SubscriberList';
import {getCursorPos, captureMouseOrTouch} from '../overlay/captureMouse';
import {startAppLoop} from '../../ui/app/startAppLoop';

let dropZones = new SubscriberList(),
   activeZone,
   nearZones,
   puppet;


export function registerDropZone(dropZone) {
   return dropZones.subscribe(dropZone);
}

export function initiateDragDrop(e, options = {}, onDragEnd) {
   let sourceEl = options.sourceEl || e.currentTarget;
   let sourceBounds = sourceEl.getBoundingClientRect();
   let cursor = getCursorPos(e);

   let cloneEl = document.createElement('div');
   cloneEl.className = "cxb-dragclone";
   cloneEl.style.left = `-1000px`;
   cloneEl.style.top = `-1000px`;
   cloneEl.style.minWidth = `${Math.ceil(sourceBounds.width)}px`;
   cloneEl.style.minHeight = `${Math.ceil(sourceBounds.height)}px`;
   document.body.appendChild(cloneEl);

   let styles = getComputedStyle(sourceEl);

   let clone = {
      ...options.clone,
   };

   let source = {
      ...options.source,
      width: sourceBounds.width,
      height: sourceBounds.height,
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
      el: cloneEl,
      clone,
      source,
      onDragEnd
   };

   if (clone.widget && clone.store) {
      puppet.stop = startAppLoop(cloneEl, clone.store, clone.widget);
   }

   let event = getDragEvent(e, 'dragstart');

   dropZones.execute(zone => {

      if (zone.onDropTest && !zone.onDropTest(event))
         return;

      if (zone.onDragStart)
         zone.onDragStart(event);
   });

   notifyDragMove(e);

   captureMouseOrTouch(e, notifyDragMove, notifyDragDrop);
}

function notifyDragMove(e) {

   let event = getDragEvent(e, 'dragmove');
   let over = null,
      best = null;

   let near = [], away = [];

   dropZones.execute(zone => {
      if (zone.onDropTest && !zone.onDropTest(event))
         return;

      if (zone.onDragMeasure) {
         let result = zone.onDragMeasure(event) || {};
         if (result.near)
            near.push(zone);
         else
            away.push(zone);

         if (typeof result.over == 'number' && (best == null || result.over < best)) {
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

   //do it last to avoid forced redraw if nothing changed
   let cursor = getCursorPos(e);
   puppet.el.style.left = `${cursor.clientX - puppet.deltaX}px`;
   puppet.el.style.top = `${cursor.clientY - puppet.deltaY}px`;
}

function notifyDragDrop(e) {
   let event = getDragEvent(e, 'dragdrop');

   if (puppet.stop)
      puppet.stop();

   document.body.removeChild(puppet.el);

   if (activeZone && activeZone.onDrop)
      activeZone.onDrop(event);

   dropZones.execute(zone => {

      if (zone.onDropTest && !zone.onDropTest(event))
         return;

      if (nearZones != null && zone.onDragAway && nearZones[zone])
         zone.onDragAway(e);

      if (zone.onDragEnd)
         zone.onDragEnd(event);
   });

   if (puppet.onDragEnd)
      puppet.onDragEnd(event);

   nearZones = null;
   activeZone = null;
   puppet = null;
}


function getDragEvent(e, type) {

   // let r = puppet.el.getBoundingClientRect();
   //
   // let bounds = {
   //    left: r.left,
   //    right: r.right,
   //    top: r.top,
   //    bottom: r.bottom
   // };

   return {
      eventType: type,
      event: e,
      cursor: getCursorPos(e),
      //itemBounds: bounds,
      source: puppet.source
   }
}

let dragCandidate = {};

export function ddMouseDown(e) {
   e.preventDefault();
   dragCandidate = {
      el: e.target,
      start: {...getCursorPos(e)}
   }
}

export function ddMouseUp() {
   dragCandidate = {};
}

export function ddDetect(e) {
   let cursor = getCursorPos(e);
   if (e.target == dragCandidate.el && Math.abs(cursor.clientX - dragCandidate.start.clientX) + Math.abs(cursor.clientY - dragCandidate.start.clientY) >= 2) {
      dragCandidate = {};
      return true;
   }
}

let lastDragHandle;

export function ddHandle(e) {
   lastDragHandle = e.target;
}

export function isDragHandleEvent(e) {
   return e.target == lastDragHandle;
}