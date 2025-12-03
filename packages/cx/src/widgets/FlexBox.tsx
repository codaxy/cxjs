/** @jsxImportSource react */
import { VDOM } from "../ui/Widget";
import { ContainerBase, StyledContainerConfig } from "../ui/Container";
import { isUndefined } from "../util/isUndefined";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";

export interface FlexBoxConfig extends StyledContainerConfig {
   /** Base CSS class. Default is `flexbox`. */
   baseClass?: string;

   /** Flex direction. Default is `row`.  */
   direction?: string;

   /**
    * Add spacing between items by applying a margin to children.
    * Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
    * Value `true` is equivalent to `medium`.
    */
   spacing?: string | boolean;

   /**
    * Add horizontal spacing between items by applying a margin to children.
    * Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
    * Value `true` is equivalent to `medium`.
    */
   hspacing?: boolean | string;

   /**
    * Add vertical spacing between items by applying a margin to children.
    * Allowed values are xsmall, small, medium, large and xlarge.
    * Value true is equivalent to medium.
    */
   vspacing?: boolean | string;

   /**
    * Add padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
    *  Value `true` is equivalent to `medium`.
    */
   pad?: boolean | string;
   padding?: boolean | string;

   /**
    * Add horizontal padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
    *  Value `true` is equivalent to `medium`.
    */
   hpad?: boolean | string;
   hpadding?: boolean | string;

   /**
    * Add vertical padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
    *  Value `true` is equivalent to `medium`.
    */
   vpad?: boolean | string;
   vpadding?: boolean | string;

   wrap?: boolean;
   align?: "start" | "center" | "end" | "baseline" | "stretch" | false;
   justify?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly" | false;
   target?: string;

   /**
    * Set to true to add overflow styles required for deeply nested flexbox calculations.
    */
   nested?: boolean;
}

export class FlexBox extends ContainerBase<FlexBoxConfig, Instance> {
   declare padding?: boolean | string;
   declare hpadding?: boolean | string;
   declare vpadding?: boolean | string;
   declare spacing?: string | boolean;
   declare hspacing?: boolean | string;
   declare vspacing?: boolean | string;
   declare pad?: boolean | string;
   declare hpad?: boolean | string;
   declare vpad?: boolean | string;
   declare wrap?: boolean;
   declare align?: "start" | "center" | "end" | "baseline" | "stretch" | false;
   declare justify?: "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly" | false;
   declare target?: string;
   declare nested?: boolean;
   declare direction?: string;

   constructor(config?: FlexBoxConfig) {
      super(config);
   }

   init(): void {
      if (this.padding) this.pad = this.padding;

      if (this.hpadding) this.hpad = this.hpadding;

      if (this.vpadding) this.vpad = this.vpadding;

      this.hpad = isUndefined(this.hpad) ? this.pad : this.hpad;
      this.vpad = isUndefined(this.vpad) ? this.pad : this.hpad;

      if (this.hpad === true) this.hpad = "medium";

      if (this.vpad === true) this.vpad = "medium";

      this.hspacing = isUndefined(this.hspacing) ? this.spacing : this.hspacing;
      this.vspacing = isUndefined(this.vspacing) ? this.spacing : this.vspacing;

      if (this.hspacing === true) this.hspacing = "medium";

      if (this.vspacing === true) this.vspacing = "medium";

      super.init();
   }

   initInstance(context: RenderingContext, instance: Instance): void {
      (instance as any).eventHandlers = instance.getJsxEventProps();
      super.initInstance(context, instance);
   }

   prepareCSS(context: RenderingContext, instance: Instance): void {
      let { data } = instance;
      data.stateMods = {
         ...data.stateMods,
         [this.hpad + "-hpad"]: this.hpad,
         [this.vpad + "-vpad"]: this.vpad,
         nested: this.nested,
      };
      super.prepareCSS(context, instance);
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      let { data } = instance;
      let eventHandlers = (instance as any).eventHandlers;
      let { CSS, baseClass } = this;
      let flexboxMods = {
         [this.hspacing + "-hspacing"]: this.hspacing,
         [this.vspacing + "-vspacing"]: this.vspacing,
         ["align-" + this.align]: this.align,
         ["justify-" + this.justify]: this.justify,
         wrap: this.wrap,
         ["target-" + this.target]: true,
         [this.direction!]: true,
      };

      return (
         <div key={key} className={data.classNames as string} style={data.style as any} {...eventHandlers}>
            <div className={CSS.element(baseClass!, "flexbox", flexboxMods)}>{this.renderChildren(context, instance)}</div>
         </div>
      );
   }
}

FlexBox.prototype.baseClass = "flexbox";
FlexBox.prototype.styled = true;
FlexBox.prototype.direction = 'row';
FlexBox.prototype.spacing = false;
FlexBox.prototype.hspacing = undefined;
FlexBox.prototype.vspacing = undefined;
FlexBox.prototype.pad = false;
FlexBox.prototype.hpad = undefined;
FlexBox.prototype.vpad = undefined;
FlexBox.prototype.wrap = false;
FlexBox.prototype.align = false;
FlexBox.prototype.justify = false;
FlexBox.prototype.target = 'any';
FlexBox.prototype.nested = false;

export class FlexRow extends FlexBox {}

export class FlexCol extends FlexBox {}
FlexCol.prototype.direction = 'column';