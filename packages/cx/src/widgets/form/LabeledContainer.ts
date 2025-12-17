import { isSelector } from "../../data/isSelector";
import type { Instance } from "../../ui/Instance";
import type { CxChild, RenderingContext } from "../../ui/RenderingContext";
import { Widget } from "../../ui/Widget";
import { FieldGroup, FieldGroupConfig } from "./FieldGroup";
import { Label } from "./Label";
import { StringProp, Config, BooleanProp, ModProp } from "../../ui/Prop";
import { Create } from "../../util/Component";

export interface LabeledContainerConfig extends FieldGroupConfig {
   /** The label. */
   label?: StringProp | Create<typeof Label>;

   /** Set to true to disable the field. */
   disabled?: BooleanProp;

   /** CSS modifier classes. */
   mod?: ModProp;

   /** Set to true to display an asterisk next to the label. */
   asterisk?: BooleanProp;
}

export class LabeledContainer extends FieldGroup<LabeledContainerConfig> {
   declare label?: string | Record<string, unknown> | Label | Widget; // Can be string, selector, Label widget config, or Widget
   declare disabled?: boolean;
   declare mod?: Record<string, unknown>;
   declare asterisk?: boolean;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         label: undefined,
      });
   }

   init(): void {
      if (this.label != null) {
         let labelConfig: any = {
            type: Label,
            disabled: this.disabled,
            mod: this.mod,
            asterisk: this.asterisk,
            required: true,
         };

         if ((this.label as any).isComponentType) labelConfig = this.label as Record<string, unknown>;
         else if (isSelector(this.label)) labelConfig.text = this.label;
         else Object.assign(labelConfig, this.label);

         this.label = Widget.create(labelConfig);
      }

      super.init();
   }

   initComponents(context: RenderingContext, instance: Instance, ...args: Record<string, unknown>[]): void {
      return super.initComponents(context, instance, ...args, {
         label: this.label,
      });
   }

   renderLabel(context: RenderingContext, instance: Instance, key?: string): CxChild {
      if (instance.components && instance.components.label) return instance.components.label.render(context);
      return null;
   }

   render(context: RenderingContext, instance: Instance, key: string): { label: CxChild; content: CxChild } {
      return {
         label: this.renderLabel(context, instance),
         content: this.renderChildren(context, instance),
      };
   }
}

LabeledContainer.prototype.styled = true;

Widget.alias("labeled-container", LabeledContainer);
