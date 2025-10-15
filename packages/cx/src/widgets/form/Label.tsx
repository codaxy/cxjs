import type { RenderingContext } from "../../ui/RenderingContext";
import type { WidgetInstance } from "../../types/instance";
import type { RenderProps } from "../../types/instance";
import { Widget, VDOM } from "../../ui/Widget";
import { HtmlElement } from "../HtmlElement";
import { FocusManager } from "../../ui/FocusManager";
import { isArray } from "../../util/isArray";
import { coalesce } from "../../util/coalesce";

export class Label extends HtmlElement {
   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         required: undefined,
         disabled: undefined,
         htmlFor: undefined,
         asterisk: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: WidgetInstance): void {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         disabled: data.disabled,
      };
      data._disabled = data.disabled;
      super.prepareData(context, instance);
   }

   explore(context: RenderingContext, instance: WidgetInstance): void {
      let { data } = instance;

      if (!data.htmlFor) data.htmlFor = context.lastFieldId;

      data.disabled = data.stateMods.disabled = coalesce(
         context.parentStrict ? context.parentDisabled : null,
         data._disabled,
         context.parentDisabled
      );

      data.asterisk = context.parentAsterisk || data.asterisk;

      if (instance.cache("disabled", data.disabled) || instance.cache("asterisk", data.asterisk)) {
         instance.markShouldUpdate(context);
         this.prepareCSS(context, instance);
      }

      super.explore(context, instance);
   }

   isValidHtmlAttribute(attrName: string): boolean {
      switch (attrName) {
         case "asterisk":
         case "required":
            return false;
      }
      return super.isValidHtmlAttribute(attrName);
   }

   attachProps(context: RenderingContext, instance: WidgetInstance, props: RenderProps): void {
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
         props.children.push(" ");
         props.children.push(
            <span key="asterisk" className={this.CSS.element(this.baseClass, "asterisk")}>
               *
            </span>
         );
      }
   }
}

Label.prototype.baseClass = "label";
Label.prototype.tag = "label";
Label.prototype.asterisk = false;
