import {Widget} from './Widget';
import {HtmlElement} from './HtmlElement';
import {MsgBox} from './overlay/MsgBox';

export class Button extends HtmlElement {

   declareData() {
      super.declareData(...arguments, {
         confirm: { structured: true }
      })
   }

   attachProps(context, instance, props) {
      super.attachProps(context, instance, props)
      props.type = 'button';
      delete props.confirm;

      var {data} = instance;

      if (data.confirm) {
         var oldOnClick = props.onClick;
         props.onClick = e => {
            e.stopPropagation();
            MsgBox.yesNo(data.confirm)
                  .then(btn => {
                     if (btn == 'yes')
                        oldOnClick.call(this, null);
                  });
         }
      }
   }
}

Button.prototype.tag = 'button';
Button.prototype.baseClass = 'button';

Widget.alias('button', Button);