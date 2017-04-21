import {Widget, VDOM, getContentArray} from '../ui/Widget';
import {HtmlElement} from './HtmlElement';
import {MsgBox} from './overlay/MsgBox';
import {Icon} from './Icon';
import {stopPropagation} from '../util/eventCallbacks';
import {preventFocus} from '../ui/FocusManager';

export class Button extends HtmlElement {
   declareData() {
      super.declareData(...arguments, {
         confirm: {structured: true},
         pressed: undefined,
         icon: undefined
      })
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         pressed: data.pressed
      };
      super.prepareData(context, instance);
   }

   attachProps(context, instance, props) {
      super.attachProps(context, instance, props);

      if (!this.focusOnMouseDown) {
         props.onMouseDown = e => {
            if (this.onMouseDown)
               this.onMouseDown(e, instance);
            e.stopPropagation();
            preventFocus(e);
         }
      }

      if (!props.onMouseDown)
         props.onMouseDown = stopPropagation;

      if (!props.onTouchStart)
         props.onTouchStart = stopPropagation;

      if (this.dismiss) {
         props.onClick = () => {
            if (instance.parentOptions && typeof instance.parentOptions.dismiss == 'function')
               instance.parentOptions.dismiss();
         }
      }

      props.type = this.submit ? 'submit' : 'button';

      delete props.confirm;
      delete props.dismiss;
      delete props.pressed;
      delete props.submit;
      delete props.focusOnMouseDown;
      delete props.icon;

      let oldOnClick, {data} = instance;

      if (data.confirm) {
         oldOnClick = props.onClick;
         props.onClick = e => {
            e.stopPropagation();
            MsgBox.yesNo(data.confirm)
               .then(btn => {
                  if (btn == 'yes')
                     oldOnClick.call(this, null);
               });
         }
      }

      let icon, children;

      if (data.icon) {
         icon = Icon.render(data.icon, {
            key: 'icon',
            className: this.CSS.element(this.baseClass, 'icon')
         });
         children = getContentArray(props.children);
         props.children = [icon, ...children];
         props.className = this.CSS.expand(props.className, this.CSS.state('icon'), children.length == 0 && this.CSS.state('empty'));

         if (children.length == 0) {
            props.children.push(<span key="baseline" className={this.CSS.element(this.baseClass, 'baseline')}>&nbsp;</span>);
         }
      }
   }
}

Button.prototype.tag = 'button';
Button.prototype.baseClass = 'button';
Button.prototype.icon = false;
Button.prototype.focusOnMouseDown = false;
Button.prototype.submit = false;

Widget.alias('button', Button);