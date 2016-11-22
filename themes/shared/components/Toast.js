import {Widget, VDOM, getContent} from 'cx/ui/Widget';
import {Overlay} from 'cx/ui/overlay/Overlay';
import {Text} from 'cx/ui/Text';
import {Button} from 'cx/ui/Button';

export class Toast extends Overlay {

   initComponents() {
      return super.initComponents({
         close: this.closable && Widget.create(Button, {
            mod: 'hollow',
            dismiss: true,
            text: 'X'
         })
      })
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         pad: this.pad
      };
      super.prepareData(context, instance);
   }

   renderContents(context, instance, key) {
      let {data, components} = instance;
      let close = components.close && getContent(components.close.render(context));

      return [
         this.renderChildren(context, instance),
         close
      ];
   }

   containerFactory(context, instance) {
      let el = document.createElement('div');
      el.className = 'cxe-toaster-item';
      let toaster = getToaster(this.placement);
      toaster.el.appendChild(el);
      return el;
   }
}

const toasters = {};

function getToaster(placement) {
   let t = toasters[placement];
   if (!t) {
      let el = document.createElement('div');
      el.className = 'cxb-toaster';
      document.body.appendChild(el);
      t = toasters[placement] = {
         el
      };
   }
   return t;
}

Toast.prototype.styled = true;
Toast.prototype.pad = true;
Toast.prototype.animate = true;
Toast.prototype.baseClass = 'toast';
Toast.prototype.closable = false;
Toast.prototype.placement = 'top';
Toast.prototype.destroyDelay = 2000;