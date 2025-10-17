import {Widget} from '../../ui/Widget';
import {FieldGroup} from './FieldGroup';
import {Label} from './Label';
import {isSelector} from '../../data/isSelector';
import type { RenderingContext } from '../../ui/RenderingContext';
import type { Instance } from '../../ui/Instance';

export class LabeledContainer extends FieldGroup
{
   label?: unknown; // Can be string, selector, or Label widget config
   disabled?: unknown;
   mod?: unknown;
   asterisk?: boolean;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData({
         label: undefined
      }, ...args);
   }

   init(): void {

      if (this.label != null) {
         let labelConfig: Record<string, unknown> = {
            type: Label,
            disabled: this.disabled,
            mod: this.mod,
            asterisk: this.asterisk,
            required: true
         };

         if ((this.label as any).isComponentType)
            labelConfig = this.label as Record<string, unknown>;
         else if (isSelector(this.label))
            labelConfig.text = this.label;
         else
            Object.assign(labelConfig, this.label);

         this.label = Widget.create(labelConfig);
      }

      super.init();
   }

   initComponents(context: RenderingContext, instance: Instance, ...args: unknown[]): Record<string, Widget> {
      return super.initComponents(context, instance, ...args, {
         label: this.label
      });
   }

   renderLabel(context: RenderingContext, instance: Instance, key?: string | number): React.ReactNode {
      if (instance.components && instance.components.label)
         return instance.components.label.render(context, key!);
      return null;
   }

   render(context: RenderingContext, instance: Instance, key: string): { label: React.ReactNode; content: React.ReactNode } {
      return {
         label: this.renderLabel(context, instance),
         content: this.renderChildren(context, instance)
      }
   }
}

LabeledContainer.prototype.styled = true;

Widget.alias('labeled-container', LabeledContainer);
