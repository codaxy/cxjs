import {Widget, VDOM, getContentArray} from '../ui/Widget';
import {HtmlElement} from './HtmlElement';
import {yesNo} from './overlay/alerts';
import {Icon} from './Icon';
import {preventFocus} from '../ui/FocusManager';
import {isFunction} from '../util/isFunction';
import {isDefined} from '../util/isDefined';

export class Button extends HtmlElement {
   declareData() {
      super.declareData(...arguments, {
         confirm: {structured: true},
         pressed: undefined,
         icon: undefined,
         disabled: undefined,
         enabled: undefined
      })
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         pressed: data.pressed
      };
      if (isDefined(data.enabled))
         data.disabled = !data.enabled;

      super.prepareData(context, instance);
   }

   explore(context, instance) {
      instance.data.parentDisabled = context.parentDisabled;
      if (instance.cache('parentDisabled', context.parentDisabled))
         instance.markShouldUpdate(context);

      super.explore(context, instance);
   }

   attachProps(context, instance, props) {
      super.attachProps(context, instance, props);

      if (!this.focusOnMouseDown) {
         props.onMouseDown = e => {
            if (this.onMouseDown)
               instance.invoke("onMouseDown", e, instance);
            preventFocus(e);
         }
      }

      if (this.dismiss) {
         let { onClick } = props;
         
         props.onClick = (...args) => {
            if (onClick && onClick(...args) === false) return;

            if (instance.parentOptions && isFunction(instance.parentOptions.dismiss))
               instance.parentOptions.dismiss();
         }
      }

      if (this.tag === "button")
         props.type = this.submit ? 'submit' : 'button';

      delete props.confirm;
      delete props.dismiss;
      delete props.pressed;
      delete props.submit;
      delete props.focusOnMouseDown;
      delete props.icon;
      delete props.enabled;

      let oldOnClick, {data} = instance;

      props.disabled = data.disabled || data.parentDisabled;

      if (data.confirm) {
         oldOnClick = props.onClick;
         props.onClick = () => {
            yesNo(data.confirm)
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