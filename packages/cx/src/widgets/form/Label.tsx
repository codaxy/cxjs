/** @jsxImportSource react */
import { FocusManager } from "../../ui/FocusManager";
import type { Instance, RenderProps } from "../../ui/Instance";
import type { RenderingContext } from "../../ui/RenderingContext";
import { BooleanProp, StringProp } from "../../ui/Prop";
import { coalesce } from "../../util/coalesce";
import { isArray } from "../../util/isArray";
import { HtmlElement, HtmlElementConfig, HtmlElementInstance } from "../HtmlElement";
import type { FormRenderingContext } from "./ValidationGroup";

export interface LabelConfig extends HtmlElementConfig {
   /** Used in combination with `asterisk` to indicate required fields. */
   required?: BooleanProp;

   /** Set to true to disable the label. */
   disabled?: BooleanProp;

   /** Id of the field. */
   htmlFor?: StringProp;

   /** Set to `true` to add red asterisk for required fields. */
   asterisk?: BooleanProp;
}

export class Label extends HtmlElement {
   declare required?: BooleanProp;
   declare disabled?: BooleanProp;
   declare htmlFor?: StringProp;
   declare asterisk?: BooleanProp;

   constructor(config?: LabelConfig) {
      super(config);
   }

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         required: undefined,
         disabled: undefined,
         htmlFor: undefined,
         asterisk: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: HtmlElementInstance): void {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         disabled: data.disabled,
      };
      data._disabled = data.disabled;
      super.prepareData(context, instance);
   }

   explore(context: FormRenderingContext, instance: Instance): void {
      let { data } = instance;

      if (!data.htmlFor) data.htmlFor = context.lastFieldId;

      data.disabled = data.stateMods.disabled = coalesce(
         context.parentStrict ? context.parentDisabled : null,
         data._disabled,
         context.parentDisabled,
      );

      data.asterisk = context.parentAsterisk || data.asterisk;

      if (instance.cache("disabled", data.disabled) || instance.cache("asterisk", data.asterisk)) {
         instance.markShouldUpdate(context);
         this.prepareCSS(context, instance);
      }

      super.explore(context, instance);
   }

   isValidHtmlAttribute(attrName: string): string | false {
      switch (attrName) {
         case "asterisk":
         case "required":
            return false;
      }
      return super.isValidHtmlAttribute(attrName);
   }

   attachProps(context: RenderingContext, instance: HtmlElementInstance, props: RenderProps): void {
      super.attachProps(context, instance, props);

      let { data } = instance;

      if (data.htmlFor) {
         props.htmlFor = data.htmlFor;

         if (!props.onClick)
            props.onClick = () => {
               //additional focus for LookupFields which are not input based
               let el = document.getElementById(instance.data.htmlFor);
               if (el) FocusManager.focusFirst(el);
            };
      }

      if (!props.id && data.htmlFor) props.id = `${data.htmlFor}-label`;

      if (data.required && data.asterisk) {
         if (!isArray(props.children)) props.children = [props.children];
         const children = props.children as React.ReactNode[];
         children.push(" ");
         children.push(
            <span key="asterisk" className={this.CSS.element(this.baseClass!, "asterisk")}>
               *
            </span>,
         );
      }
   }
}

Label.prototype.baseClass = "label";
Label.prototype.tag = "label";
Label.prototype.asterisk = false;
