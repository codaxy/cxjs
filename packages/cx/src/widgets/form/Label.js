import { Widget, VDOM } from "../../ui/Widget";
import { HtmlElement } from "../HtmlElement";
import { FocusManager } from "../../ui/FocusManager";
import { isArray } from "../../util/isArray";
import { coalesce } from "../../util/coalesce";

export class Label extends HtmlElement {
   declareData() {
      super.declareData(...arguments, {
         required: undefined,
         disabled: undefined,
         htmlFor: undefined,
      });
   }

   prepareData(context, instance) {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         disabled: data.disabled,
      };
      data._disabled = data.disabled;
      super.prepareData(context, instance);
   }

   explore(context, instance) {
      let { data } = instance;

      if (!data.htmlFor) data.htmlFor = context.lastFieldId;

      data.disabled = data.stateMods.disabled = coalesce(
         context.parentStrict ? context.parentDisabled : null,
         data._disabled,
         context.parentDisabled
      );

      if (instance.cache('disabled', data.disabled)) {
         instance.markShouldUpdate(context);
         this.prepareCSS(context, instance);
      }

      super.explore(context, instance);
   }

   isValidHtmlAttribute(attrName) {
      switch (attrName) {
         case "asterisk":
         case "required":
            return false;
      }
      return super.isValidHtmlAttribute(attrName);
   }

   attachProps(context, instance, props) {
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

      if (this.asterisk && data.required) {
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
