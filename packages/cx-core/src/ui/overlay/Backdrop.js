import {CSS} from '../CSS';

var backdropCount = 0;

export class Backdrop {

   static count() {
      return backdropCount;
   }

   static add(options = {}) {

      var el = document.createElement('div');
      el.className = CSS.block('backdrop');
      el.style.zIndex = 1000;
      document.body.appendChild(el);
      backdropCount++;

      var remove = function () {
         if (el) {
            document.body.removeChild(el);
            el = null;
            backdropCount--;
         }
      }

      el.addEventListener('click', e=> {
         if (options.callback)
            options.callback();
         if (options.autoRemove)
            remove();
      });

      return remove;
   }
}