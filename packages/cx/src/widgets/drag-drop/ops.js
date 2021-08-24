import { SubscriberList } from "../../util/SubscriberList";
import { getCursorPos, captureMouseOrTouch } from "../overlay/captureMouse";
import { startAppLoop } from "../../ui/app/startAppLoop";
import { getScrollerBoundingClientRect } from "../../util/getScrollerBoundingClientRect";
import { isNumber } from "../../util/isNumber";
import { isObject } from "../../util/isObject";
import { isString } from "../../util/isString";
import { ZIndexManager } from "../../ui/ZIndexManager";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import { VDOM } from "../../ui/VDOM";
import { Container } from "../../ui/Container";
import { Console } from "../../util";

let dropZones = new SubscriberList(),
   dragStartedZones,
   activeZone,
   nearZones,
   puppet,
   scrollTimer,
   vscrollParent,
   hscrollParent;

export function registerDropZone(dropZone) {
   return dropZones.subscribe(dropZone);
}

export function initiateDragDrop(e, options = {}, onDragEnd) {
   if (puppet) {
      //last operation didn't finish properly
      notifyDragDrop(e);
   }

   let sourceEl = options.sourceEl || e.currentTarget;
   let sourceBounds = getTopLevelBoundingClientRect(sourceEl);
   let cursor = getCursorPos(e);

   let clone = {
      ...options.clone,
   };

   let cloneEl = document.createElement("div");
   cloneEl.classList.add("cxb-dragclone");
   if (isString(clone["class"])) cloneEl.classList.add(clone["class"]);
   if (isObject(clone.style)) Object.assign(cloneEl.style, clone.style);
   cloneEl.style.left = `-1000px`;
   cloneEl.style.top = `-1000px`;

   if (clone.matchSize || clone.matchWidth) cloneEl.style.width = `${Math.ceil(sourceBounds.width)}px`;

   if (clone.matchSize || clone.matchHeight) cloneEl.style.height = `${Math.ceil(sourceBounds.height)}px`;

   cloneEl.style.zIndex = ZIndexManager.next() + 1000;

   if (clone.cloneContent) {
      cloneEl.appendChild(sourceEl.cloneNode(true));
   }

   document.body.appendChild(cloneEl);

   let styles = getComputedStyle(sourceEl);

   let deltaX = clone.matchCursorOffset ? cursor.clientX - sourceBounds.left : -3;
   let deltaY = clone.matchCursorOffset ? cursor.clientY - sourceBounds.top : -3;

   let source = {
      ...options.source,
      width: sourceBounds.width,
      height: sourceBounds.height,
      deltaX,
      deltaY,
      margin: [
         styles.getPropertyValue("margin-top"),
         styles.getPropertyValue("margin-right"),
         styles.getPropertyValue("margin-bottom"),
         styles.getPropertyValue("margin-left"),
      ],
   };

   puppet = {
      deltaX,
      deltaY,
      el: cloneEl,
      clone,
      source,
      onDragEnd,
   };

   if (clone.widget && clone.store && !clone.cloneContent) {
      let content = (
         <cx>
            <ContextWrap value={{ disabled: true }}>{clone.widget}</ContextWrap>
         </cx>
      );
      puppet.stop = startAppLoop(cloneEl, clone.store, content, {
         removeParentDOMElement: true,
      });
   } else {
      puppet.stop = () => {
         document.body.removeChild(cloneEl);
      };
   }

   let event = getDragEvent(e, "dragstart");

   dragStartedZones = new WeakMap();

   dropZones.execute((zone) => {
      if (zone.onDropTest)
         try {
            if (!zone.onDropTest(event)) return;
         }
         catch (err) {
            Console.warn("Drop zone onDropTest failed. Error: ", err, zone);
            return;
         }

      if (zone.onDragStart) zone.onDragStart(event);

      dragStartedZones.set(zone, true);
   });

   notifyDragMove(e);

   captureMouseOrTouch(e, notifyDragMove, notifyDragDrop);
}

function notifyDragMove(e, captureData) {
   let event = getDragEvent(e, "dragmove");
   let over = null,
      overTest = null,
      best = null;

   let near = [],
      away = [];

   dropZones.execute((zone) => {
      let test;
      try {
         test = zone.onDropTest && zone.onDropTest(event);
         if (!test) return;
      }
      catch (err) {
         //the problem is already reported, so here we just swallow the bug to avoid spammming the console too much
         return;
      }

      if (zone.onDragMeasure) {
         let result = zone.onDragMeasure(event, { test }) || {};

         if (result.near) near.push(zone);
         else away.push(zone);

         if (isNumber(result.over) && (best == null || result.over < best)) {
            over = zone;
            overTest = test;
            best = result.over;
         }
      }
   });

   let newNear = new WeakMap();

   if (nearZones != null) {
      away.forEach((z) => {
         if (z.onDragAway && nearZones.has(z)) z.onDragAway(z);
      });
   }

   near.forEach((z) => {
      if (z.onDragNear && z != over && (nearZones == null || !nearZones.has(z))) {
         z.onDragNear(z);
         newNear.set(z, true);
      }
   });

   nearZones = newNear;

   if (over != activeZone) {
      vscrollParent = null;
      hscrollParent = null;
   }

   if (over != activeZone && activeZone && activeZone.onDragLeave) activeZone.onDragLeave(event);

   if (over != activeZone && over) {
      if (over.onDragEnter) over.onDragEnter(event);

      vscrollParent = over.onGetVScrollParent && over.onGetVScrollParent({ test: overTest });
      hscrollParent = over.onGetHScrollParent && over.onGetHScrollParent({ test: overTest });
   }

   activeZone = over;

   if (over && over.onDragOver) {
      over.onDragOver(event, { test: overTest });
   }

   //do it last to avoid forced redraw if nothing changed
   let cursor = getCursorPos(e);
   puppet.el.style.left = `${cursor.clientX - puppet.deltaX}px`;
   puppet.el.style.top = `${cursor.clientY - puppet.deltaY}px`;

   if (vscrollParent || hscrollParent) {
      let scrollX = 0,
         scrollY = 0;
      let vscrollBounds = vscrollParent && getScrollerBoundingClientRect(vscrollParent, true);
      let hscrollBounds =
         hscrollParent == vscrollParent
            ? vscrollBounds
            : hscrollParent && getScrollerBoundingClientRect(hscrollParent, true);

      if (vscrollBounds) {
         if (cursor.clientY < vscrollBounds.top + 20) scrollY = -1;
         else if (cursor.clientY >= vscrollBounds.bottom - 20) scrollY = 1;
      }

      if (hscrollBounds) {
         if (cursor.clientX < hscrollBounds.left + 20) scrollX = -1;
         else if (cursor.clientX >= hscrollBounds.right - 20) scrollX = 1;
      }

      if (scrollY || scrollX) {
         if (!scrollTimer) {
            let cb = () => {
               if (scrollY) {
                  let current = vscrollParent.scrollTop;
                  let next = Math.min(
                     vscrollParent.scrollHeight,
                     Math.max(0, current + (scrollY * 5 * Math.min(200, Math.max(50, event.source.height))) / 60)
                  ); //60 FPS
                  vscrollParent.scrollTop = next;
               }
               if (scrollX) {
                  let current = hscrollParent.scrollLeft;
                  let next = Math.min(
                     hscrollParent.scrollWidth,
                     Math.max(0, current + (scrollX * 5 * Math.min(200, Math.max(50, event.source.width))) / 60)
                  ); //60 FPS
                  hscrollParent.scrollLeft = next;
               }
               scrollTimer = requestAnimationFrame(cb);
            };
            scrollTimer = requestAnimationFrame(cb);
         }
      } else {
         clearScrollTimer();
      }
   } else clearScrollTimer();
}

function clearScrollTimer() {
   if (scrollTimer) {
      cancelAnimationFrame(scrollTimer);
      scrollTimer = null;
   }
}

function notifyDragDrop(e) {
   clearScrollTimer();

   let event = getDragEvent(e, "dragdrop");

   if (puppet.stop) puppet.stop();

   if (activeZone && activeZone.onDrop) event.result = activeZone.onDrop(event);

   dropZones.execute((zone) => {
      if (nearZones != null && zone.onDragAway && nearZones.has(zone)) zone.onDragAway(e);

      if (!dragStartedZones.has(zone)) return;

      if (zone.onDragEnd) zone.onDragEnd(event);
   });

   if (puppet.onDragEnd) puppet.onDragEnd(event);

   nearZones = null;
   activeZone = null;
   puppet = null;
   dragStartedZones = null;
}

function getDragEvent(e, type) {
   return {
      type: type,
      event: e,
      cursor: getCursorPos(e),
      source: puppet.source,
   };
}

let dragCandidate = {};

export function ddMouseDown(e) {
   //do not allow that the same event is processed by multiple drag sources
   //the first (top-level) source should be a drag-candidate
   if (e.timeStamp <= dragCandidate.timeStamp) return;

   dragCandidate = {
      el: e.currentTarget,
      start: { ...getCursorPos(e) },
      timeStamp: e.timeStamp
   };
}

export function ddMouseUp() {
   dragCandidate = {};
}

export function ddDetect(e) {
   let cursor = getCursorPos(e);
   if (
      e.currentTarget == dragCandidate.el &&
      Math.abs(cursor.clientX - dragCandidate.start.clientX) + Math.abs(cursor.clientY - dragCandidate.start.clientY) >=
      2
   ) {
      dragCandidate = {};
      return true;
   }
}

let lastDragHandle;

export function ddHandle(e) {
   lastDragHandle = e.currentTarget;
}

export function isDragHandleEvent(e) {
   return lastDragHandle && (e.target == lastDragHandle || lastDragHandle.contains(e.target));
}

export const DragDropContext = VDOM.createContext
   ? VDOM.createContext({ disabled: false })
   : ({ children }) => children;

class ContextWrap extends Container {
   render(context, instance, key) {
      return (
         <DragDropContext.Provider value={this.value} key={key}>
            {this.renderChildren(context, instance)}
         </DragDropContext.Provider>
      );
   }
}
