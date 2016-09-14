

export function captureMouse(e, onMouseMove, onMouseUp, captureData, cursor) {

   var surface;

   if (e.target.setCapture)
   {
      surface = e.currentTarget;
      surface.setCapture();
   } else {
      surface = document.createElement('div');
      surface.className = 'cxb-mousecapture';
      if (cursor)
         surface.style.cursor = cursor;
      document.body.appendChild(surface);
   }

   var move = e => {
      if (onMouseMove)
         onMouseMove(e, captureData);
      e.stopPropagation();
      e.preventDefault(); //disable text selection
   };

   var end = e=> {
      try {
         if (onMouseUp)
            onMouseUp(e);
      } finally {
         surface.removeEventListener('mousemove', move);
         surface.removeEventListener('mouseup', end);
         if (surface.releaseCapture)
            surface.releaseCapture();
         else
            document.body.removeChild(surface);
      }
   };

   surface.addEventListener('mousemove', move);
   surface.addEventListener('mouseup', end);

   e.stopPropagation();
}

export function captureMouseOrTouch(e, onMouseMove, onMouseUp, captureData, cursor) {

   if (e.type.indexOf('touch') == 0) {

      var el = e.currentTarget;

      var move = e => {
         if (onMouseMove)
            onMouseMove(e, captureData);
         e.preventDefault();
      };

      var end = e=> {

         el.removeEventListener('touchmove', move);
         el.removeEventListener('touchend', end);

         if (onMouseUp)
            onMouseUp(e);

         e.preventDefault();
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