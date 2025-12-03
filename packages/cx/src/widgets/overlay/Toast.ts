import { OverlayBase, OverlayConfig, OverlayInstance } from "./Overlay";
import { Text } from "../../ui/Text";
import { RenderingContext } from "../../ui/RenderingContext";
import { NumberProp, StringProp, RecordsProp } from "../../ui/Prop";

export interface ToastConfig extends OverlayConfig {
   /** Value of timeout in milliseconds after which the toast is automatically dismissed. */
   timeout?: NumberProp;

   message?: StringProp;

   /** Add default padding. Default is `true`. */
   pad?: boolean;

   /**
    * Defines where the toast will be placed.
    * Supported values are `top`, `right`, `bottom` and `left`. Default value is `top`.
    */
   placement?: string;
}

export class Toast extends OverlayBase<ToastConfig, OverlayInstance> {
   declare message?: StringProp;
   declare pad?: boolean;
   declare placement?: string;

   init(): void {
      if (this.message)
         this.items = {
            type: Text,
            value: this.message,
         } as any;
      super.init();
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         timeout: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: OverlayInstance): void {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         pad: this.pad,
      };
      super.prepareData(context, instance);
   }

   overlayDidUpdate(instance: OverlayInstance, component: any): void {
      let el = component.containerEl || component.props.parentEl;
      if (component.state.animated) {
         el.style.height = `${component.el.offsetHeight}px`;
         el.classList.add(this.CSS.state("live"));
      }
   }

   overlayDidMount(instance: OverlayInstance, component: any): void {
      let { data } = instance;
      if (data.timeout > 0) {
         component.timeoutTimer = setTimeout(() => {
            instance.dismiss!();
         }, data.timeout);
      }
   }

   overlayWillUnmount(instance: OverlayInstance, component: any): void {
      let el = component.containerEl || component.props.parentEl;
      el.style.height = 0;
      el.classList.remove(this.CSS.state("live"));
      if (component.timeoutTimer) clearTimeout(component.timeoutTimer);
   }

   containerFactory(): HTMLElement {
      let el = document.createElement("div");
      el.className = this.CSS.element("toaster", "item");
      let placement = this.placement || "top";
      let toaster = getToaster(placement);
      toaster.el.className = this.CSS.block("toaster", null, {
         [`placement-${placement}`]: true,
      });
      toaster.el.insertBefore(el, toaster.el.firstChild);
      return el;
   }
}

interface ToasterInfo {
   el: HTMLElement;
}

const toasters: Record<string, ToasterInfo> = {};

function getToaster(placement: string): ToasterInfo {
   let t = toasters[placement];
   if (!t) {
      let el = document.createElement("div");
      document.body.appendChild(el);
      t = toasters[placement] = {
         el,
      };
   }
   return t;
}

Toast.prototype.styled = true;
Toast.prototype.pad = true;
Toast.prototype.animate = true;
Toast.prototype.baseClass = "toast";
Toast.prototype.placement = "top";
Toast.prototype.destroyDelay = 300;
