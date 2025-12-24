/** @jsxImportSource react */
import { Widget, VDOM, getContentArray } from "../ui/Widget";
import { HtmlElement, HtmlElementConfig, HtmlElementInstance } from "./HtmlElement";
import { yesNo } from "./overlay/alerts";
import { Icon } from "./Icon";
import { preventFocus } from "../ui/FocusManager";
import { isFunction } from "../util/isFunction";
import { isDefined } from "../util/isDefined";
import { coalesce } from "../util/coalesce";
import type { RenderingContext } from "../ui/RenderingContext";
import type { Instance, RenderProps } from "../ui/Instance";
import { YesNoResult } from "../ui/Instance";
import { BooleanProp, StringProp, Prop, ModProp } from "../ui/Prop";
import type { FormRenderingContext } from "./form/ValidationGroup";

export interface ButtonConfig extends Omit<HtmlElementConfig<"button">, "disabled" | "type" | "form"> {
   /** Confirmation text or configuration object. See MsgBox.yesNo for more details. */
   confirm?: Prop<string | Record<string, unknown> | false>;

   /** If true button appears in pressed state. Useful for implementing toggle buttons. */
   pressed?: BooleanProp;

   /** Name of the icon to be put on the left side of the button. */
   icon?: StringProp;

   /** Base CSS class to be applied to the element. Default is 'button'. */
   baseClass?: string;

   /**
    * Determines if button should receive focus on mousedown event.
    * Default is `false`, which means that focus can be set only using the keyboard `Tab` key.
    */
   focusOnMouseDown?: boolean;

   /** Add type="submit" to the button. */
   submit?: boolean;

   /** Set to `true` to disable the button. */
   disabled?: BooleanProp;

   /** Set to `false` to disable the button. */
   enabled?: BooleanProp;

   /**
    * Click handler.
    *
    * @param e - Event.
    * @param instance - Cx widget instance that fired the event.
    */
   onClick?: string | ((e: React.MouseEvent, instance: Instance) => void);

   /** Button type. */
   type?: "submit" | "button";

   /** If set to `true`, the Button will cause its parent Overlay (if one exists) to close. This, however, can be prevented if `onClick` explicitly returns `false`. */
   dismiss?: boolean;

   /** The form attribute specifies the form the button belongs to.
    * The value of this attribute must be equal to the `id` attribute of a `<form>` element in the same document.
    */
   form?: StringProp;
}

export class Button extends HtmlElement<ButtonConfig, HtmlElementInstance> {
   constructor(config?: ButtonConfig) {
      super(config);
   }

   declare icon?: boolean | string;
   declare focusOnMouseDown?: boolean;
   declare submit?: boolean;
   declare dismiss?: boolean;
   declare onMouseDown?: string | ((e: MouseEvent, instance: Instance) => void);
   declare baseClass: string;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         confirm: { structured: true },
         pressed: undefined,
         icon: undefined,
         disabled: undefined,
         enabled: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: HtmlElementInstance): void {
      const { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         pressed: data.pressed,
      };
      if (isDefined(data.enabled)) data.disabled = !data.enabled;

      super.prepareData(context, instance);
   }

   explore(context: FormRenderingContext, instance: HtmlElementInstance): void {
      instance.data.parentDisabled = context.parentDisabled;
      instance.data.parentStrict = context.parentStrict;

      if (instance.cache("parentDisabled", context.parentDisabled)) instance.markShouldUpdate(context);
      if (instance.cache("parentStrict", context.parentStrict)) instance.markShouldUpdate(context);

      super.explore(context, instance);
   }

   attachProps(context: RenderingContext, instance: HtmlElementInstance, props: RenderProps): void {
      super.attachProps(context, instance, props);

      if (!this.focusOnMouseDown) {
         props.onMouseDown = (e: React.MouseEvent) => {
            if (this.onMouseDown && instance.invoke("onMouseDown", e, instance) === false) return;
            preventFocus(e);
         };
      }

      if (this.dismiss) {
         const { onClick } = props;

         props.onClick = (e: React.MouseEvent) => {
            if (onClick) {
               const result = onClick(e);
               if (result === false) return;
            }

            if (instance.parentOptions && isFunction(instance.parentOptions.dismiss)) {
               instance.parentOptions.dismiss();
            }
         };
      }

      if (this.tag === "button") props.type = this.submit ? "submit" : "button";

      delete props.confirm;
      delete props.dismiss;
      delete props.pressed;
      delete props.submit;
      delete props.focusOnMouseDown;
      delete props.icon;
      delete props.enabled;

      const { data } = instance;

      props.disabled = coalesce(data.parentStrict ? data.parentDisabled : null, data.disabled, data.parentDisabled) as
         | boolean
         | undefined;

      if (data.confirm) {
         const oldOnClick = props.onClick;
         props.onClick = (e: React.MouseEvent) => {
            yesNo(data.confirm!).then((btn: string) => {
               if (btn === YesNoResult.Yes && oldOnClick) {
                  oldOnClick(e);
               }
            });
         };
      }

      if (data.icon) {
         const icon = Icon.render(data.icon, {
            key: "icon",
            className: this.CSS.element(this.baseClass, "icon"),
         });
         const children = getContentArray(props.children);
         props.children = [icon, ...children];
         props.className = this.CSS.expand(
            props.className,
            this.CSS.state("icon"),
            children.length === 0 && this.CSS.state("empty"),
         );

         if (children.length === 0) {
            (props.children as React.ReactNode[]).push(
               <span key="baseline" className={this.CSS.element(this.baseClass, "baseline")}>
                  &nbsp;
               </span>,
            );
         }
      }
   }
}

Button.prototype.tag = "button";
Button.prototype.baseClass = "button";
Button.prototype.icon = false;
Button.prototype.focusOnMouseDown = false;
Button.prototype.submit = false;

Widget.alias("button", Button);
