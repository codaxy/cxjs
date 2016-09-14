import {Widget} from '../Widget';
import {PureContainer} from '../PureContainer';
import {Label} from './Label';

export class LabeledContainer extends PureContainer
{
   render(context, instance, key) {
      var {data} = instance;
      return {
         label: this.renderLabel(key, data),
         content: this.renderChildren(context, instance, key + '-content')
      }
   }

   renderLabel(key, data) {
      var options = {
         style: {
            width: data.labelWidth
         }
      };
      return Label(key + '-label', data.label, data.id)
   }

   declareData() {
      super.declareData({
         label: undefined,
         labelWidth: undefined
      }, ...arguments);
   }
}

Widget.alias('labeled-container', LabeledContainer);
