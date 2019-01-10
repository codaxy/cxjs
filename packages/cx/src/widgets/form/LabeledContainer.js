import {Widget} from '../../ui/Widget';
import {FieldGroup} from './FieldGroup';
import {Label} from './Label';
import {isSelector} from '../../data/isSelector';

export class LabeledContainer extends FieldGroup
{
   declareData() {
      super.declareData({
         label: undefined
      }, ...arguments);
   }

   init() {

      if (this.label != null) {
         let labelConfig = {
            type: Label,
            disabled: this.disabled,
            mod: this.mod,
            asterisk: this.asterisk,
            required: true
         };

         if (this.label.isComponentType)
            labelConfig = this.label;
         else if (isSelector(this.label))
            labelConfig.text = this.label;
         else
            Object.assign(labelConfig, this.label);

         this.label = Widget.create(labelConfig);
      }

      super.init();
   }

   initComponents(context, instance) {
      return super.initComponents(...arguments, {
         label: this.label
      });
   }

   renderLabel(context, instance, key) {
      if (instance.components.label)
         return instance.components.label.render(context, key);
   }

   render(context, instance, key) {
      return {
         label: this.renderLabel(context, instance),
         content: this.renderChildren(context, instance)
      }
   }
}

Widget.alias('labeled-container', LabeledContainer);
