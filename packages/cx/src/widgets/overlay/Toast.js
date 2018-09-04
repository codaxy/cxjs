import {Overlay} from './Overlay';
import {Text} from '../../ui/Text';

export class Toast extends Overlay {

   init() {
      if (this.message)
         this.items = {
            type: Text,
            value: this.message
         };
      super.init();
   }

   declareData() {
      return super.declareData(...arguments, {
         timeout: undefined
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

   overlayDidUpdate(instance, component) {
      let el = component.containerEl || component.props.parentEl;
      if (component.state.animated) {
         el.style.height = `${component.el.offsetHeight}px`;
         el.classList.add(this.CSS.state('live'));
      }
   }

   overlayDidMount(instance, component) {
      let {data} = instance;
      if (data.timeout > 0) {
         component.timeoutTimer = setTimeout(() => {
            instance.dismiss();
         }, data.timeout);
      }
   }

   overlayWillDismiss(instance, component) {
      let el = component.containerEl || component.props.parentEl;
      el.style.height = 0;
      el.classList.remove(this.CSS.state('live'));
   }

   overlayWillUnmount(instance, component) {
      let el = component.containerEl || component.props.parentEl;
      el.style.height = 0;
      el.classList.remove(this.CSS.state('live'));
      if (component.timeoutTimer)
         clearTimeout(component.timeoutTimer)
   }

   containerFactory() {
      let el = document.createElement('div');
      el.className = this.CSS.element('toaster', 'item');
      let placement = this.placement || 'top';
      let toaster = getToaster(placement);
      toaster.el.className = this.CSS.block('toaster', null, {
         [`placement-${placement}`]: true
      });
      toaster.el.insertBefore(el, toaster.el.firstChild);
      return el;
   }
}

const toasters = {};

function getToaster(placement) {
   let t = toasters[placement];
   if (!t) {
      let el = document.createElement('div');
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
Toast.prototype.placement = 'top';
Toast.prototype.destroyDelay = 300;