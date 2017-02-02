import { VDOM } from '../../ui/Widget';

function batch(callback) {
   if (VDOM.DOM.unstable_batchedUpdates)
      VDOM.DOM.unstable_batchedUpdates(() => {
         callback();
      });
   else
      callback();
}

export function captureMouse(e, onMouseMove, onMouseUp, captureData, cursor) {

   let surface = document.createElement('div');
   surface.className = 'cxb-mousecapture';
   if (cursor)
      surface.style.cursor = cursor;
   document.body.appendChild(surface);


   let move = e => {
      batch(() => {
         if (onMouseMove)
            onMouseMove(e, captureData);
         e.stopPropagation();
         e.preventDefault(); //disable text selection
      });
   };

   let end = e => {
      batch(() => {
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
         batch(() => {
            if (onMouseMove)
               onMouseMove(e, captureData);
            e.preventDefault();
         })
      };

      var end = e=> {
         batch(() => {
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
   return (e.touches && e.touches[0]) || e;
}