import { batchUpdates } from '../../ui/batchUpdates';
import { getParentFrameBoundingClientRect } from '../../util/getParentFrameBoundingClientRect';

export function captureMouse2(e, { onMouseMove, onMouseUp, onDblClick, captureData, cursor }) {

   let surface = document.createElement('div');
   surface.className = 'cxb-mousecapture';
   surface.style.cursor = cursor || getComputedStyle(e.currentTarget).cursor;

   document.body.appendChild(surface);

   let active = true;
   surface.addEventListener('mousemove', move);
   surface.addEventListener('mouseup', end);
   if (onDblClick)
      surface.addEventListener('dblclick', doubleClick);

   function tear() {
      if (surface == null) return;
      surface.removeEventListener('mousemove', move);
      surface.removeEventListener('mouseup', end);
      if (onDblClick)
         surface.removeEventListener('dblclick', onDblClick);
      document.body.removeChild(surface);
      surface = null;
   }

   function doubleClick(e) {
      try {
         onDblClick(e);
      } finally {
         tear();
      }
   }

   e.stopPropagation();

   function move(e) {
      if (!active) {
         tear();
         return;
      }

      //if mouse moves double clicking is off
      onDblClick = null;

      batchUpdates(() => {
         if (onMouseMove)
            onMouseMove(e, captureData);
         e.stopPropagation();
         e.preventDefault(); //disable text selection
      });
   }

   function end(e) {
      active = false;
      batchUpdates(() => {
         // if (surface.releaseCapture)
         //    surface.releaseCapture();

         if (!onDblClick)
            surface.style.display = "none";
         try {
            if (onMouseUp)
               onMouseUp(e, captureData);
         } finally {
            if (onDblClick) {
               //keep the surface a little longer to detect double clicks
               setTimeout(tear, 1500);
            } else
               tear();
         }
      });
   }
}

export function captureMouseOrTouch2(e, { onMouseMove, onMouseUp, onDblClick, captureData, cursor }) {

   if (e.type.indexOf('touch') == 0) {

      let el = e.currentTarget;

      let move = e => {
         batchUpdates(() => {
            if (onMouseMove)
               onMouseMove(e, captureData);
            e.preventDefault();
         })
      };

      let end = e=> {
         batchUpdates(() => {
            el.removeEventListener('touchmove', move);
            el.removeEventListener('touchend', end);

            if (onMouseUp)
               onMouseUp(e);

            e.preventDefault();
         })
      };

      el.addEventListener('touchmove', move);
      el.addEventListener('touchend', end);

      e.stopPropagation();
   }
   else
      captureMouse2(e, { onMouseMove, onMouseUp, captureData, onDblClick, cursor });
}

export function captureMouse(e, onMouseMove, onMouseUp, captureData, cursor) {

   captureMouse2(e, {
      onMouseMove,
      onMouseUp,
      captureData,
      cursor
   })
}

export function captureMouseOrTouch(e, onMouseMove, onMouseUp, captureData, cursor) {
   captureMouseOrTouch2(e, {onMouseMove, onMouseUp, captureData, cursor});
}

export function getCursorPos(e) {
   let p = (e.touches && e.touches[0]) || e;
   let offset = getParentFrameBoundingClientRect(e.target);
   return {
      clientX: p.clientX + offset.left,
      clientY: p.clientY + offset.top
   }
}