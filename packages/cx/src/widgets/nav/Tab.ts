import { Widget, VDOM } from "../../ui/Widget";
import { HtmlElement, HtmlElementConfigBase, HtmlElementInstance } from "../HtmlElement";
import { Instance } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";
import { preventFocus, preventFocusOnTouch } from "../../ui/FocusManager";
import { isUndefined } from "../../util/isUndefined";
import { BooleanProp, Prop, StringProp } from "../../ui/Prop";

export interface TabConfig extends HtmlElementConfigBase {
   /** A value to be written to the `value` property if the tab is clicked. */
   tab?: Prop<string | number>;

   /**
    * Value of the currently selected tab.
    * If `value` is equal to `tab`, the tab appears active.
    */
   value?: StringProp;

   /** Set to `true` to disable selection. */
   disabled?: BooleanProp;

   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string;

   /** Name of the HTML element to be rendered. Default is `div`. */
   tag?: string;

   /**
    * Determines if tab should receive focus on `mousedown` event.
    * Default is `false`, which means that focus can be set only using the keyboard `Tab` key.
    */
   focusOnMouseDown?: boolean;

   /** Set to true to set the default tab. */
   default?: boolean;
}

export class Tab extends HtmlElement<TabConfig> {
   declare public baseClass: string;
   declare public tag: string;
   declare public focusOnMouseDown: boolean;
   declare public default: boolean;
   declare public shape?: string;
   declare public onMouseDown?: any;
   declare public onClick?: any;
   declareData() {
      super.declareData(
         {
            tab: undefined,
            value: undefined,
            disabled: undefined,
            text: undefined,
         },
         ...arguments,
      );
   }

   prepareData(context: RenderingContext, instance: HtmlElementInstance) {
      let { data } = instance;
      data.stateMods = {
         active: data.tab == data.value,
         disabled: data.disabled,
         shape: this.shape,
      };
      if (this.default && isUndefined(data.value)) instance.set("value", data.tab);
      super.prepareData(context, instance);
   }

   isValidHtmlAttribute(attrName: string) {
      switch (attrName) {
         case "value":
         case "tab":
         case "text":
         case "disabled":
         case "default":
            return false;

         default:
            return super.isValidHtmlAttribute(attrName);
      }
   }

   attachProps(context: RenderingContext, instance: HtmlElementInstance, props: any) {
      super.attachProps(context, instance, props);

      let { data } = instance;
      if (!data.disabled) {
         props.href = "#";
         delete props.value;

         props.onMouseDown = (e: any) => {
            if (this.onMouseDown && instance.invoke("onMouseDown", e, instance) === false) return;
            if (!this.focusOnMouseDown) preventFocus(e);
            else preventFocusOnTouch(e);
         };

         props.onClick = (e: any) => this.handleClick(e, instance);
      }
   }

   handleClick(e: any, instance: Instance) {
      if (this.onClick && instance.invoke("onClick", e, instance) === false) {
         return;
      }

      e.preventDefault();
      e.stopPropagation();

      let { data } = instance;

      if (data.disabled) return;

      instance.set("value", data.tab);
   }
}

Tab.prototype.baseClass = "tab";
Tab.prototype.tag = "a";
Tab.prototype.focusOnMouseDown = false;
Tab.prototype.default = false;

Widget.alias("tab", Tab);
