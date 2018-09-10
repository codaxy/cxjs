import { batchUpdates } from '../../ui/batchUpdates';
import { getParentFrameBoundingClientRect } from '../../util/getParentFrameBoundingClientRect';

export function captureMouse(e, onMouseMove, onMouseUp, captureData, cursor) {

   let surface = document.createElement('div');
   surface.className = 'cxb-mousecapture';
   if (cursor)
      surface.style.cursor = cursor;

   document.body.appendChild(surface);

   if (surface.setCapture) {
      e.preventDefault();
      surface.setCapture(true);
   }

   let move = e => {
      batchUpdates(() => {
         if (onMouseMove)
            onMouseMove(e, captureData);
         e.stopPropagation();
         e.preventDefault(); //disable text selection
      });
   };

   let end = e => {
      batchUpdates(() => {
         if (surface.releaseCapture)
            surface.releaseCapture();
         surface.style.display = "none";
         try {
            if (onMouseUp)
               onMouseUp(e, captureData);
         } finally {
            surface.removeEventListener('mousemove', move);
            surface.removeEventListener('mouseup', end);
            document.body.removeChild(surface);
         }
      });
   };

   surface.addEventListener('mousemove', move);
   surface.addEventListener('mouseup', end);

   e.stopPropagation();
}

export function captureMouseOrTouch(e, onMouseMove, onMouseUp, captureData, cursor) {

   if (e.type.indexOf('touch') == 0) {

      var el = e.currentTarget;

      var move = e => {
         batchUpdates(() => {
            if (onMouseMove)
               onMouseMove(e, captureData);
            e.preventDefault();
         })
      };

      var end = e=> {
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
      captureMouse(e, onMouseMove, onMouseUp, captureData, cursor || e.target.style.cursor);
}

export function getCursorPos(e) {
   let p = (e.touches && e.touches[0]) || e;
   let offset = getParentFrameBoundingClientRect(e.target);
   return {
      clientX: p.clientX + offset.left,
      clientY: p.clientY + offset.top
   }
}