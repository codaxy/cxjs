import {Widget, VDOM} from '../../ui/Widget';
import {Field} from './Field';
import {
   tooltipComponentWillReceiveProps,
   tooltipComponentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipComponentDidMount
} from '../overlay/Tooltip';
import {stopPropagation, preventDefault} from '../../util/eventCallbacks';
import {StringTemplate} from '../../data/StringTemplate';
import {Icon} from '../Icon';
import {KeyCode} from 'cx/util';

export class TextField extends Field {
   declareData() {
      super.declareData({
         value: null,
         disabled: undefined,
         readOnly: undefined,
         enabled: undefined,
         placeholder: undefined,
         required: undefined,
         minLength: undefined,
         maxLength: undefined,
      }, ...arguments);
   }

   renderInput(context, instance, key) {
      return <Input key={key} instance={instance}/>
   }

   validate(context, instance) {
      super.validate(context, instance);

      var {data} = instance;
      if (!data.error && this.validationRegExp)
         if (!this.validationRegExp.test(data.value))
            data.error = this.validationErrorText;

      if (!data.error && data.value) {
         if (typeof data.value == 'string' && data.minLength != null && data.value.length < data.minLength)
            data.error = StringTemplate.format(this.minLengthValidationErrorText, data.minLength, data.value.length);
         else if (typeof data.value == 'string' && data.maxLength != null && data.value.length > data.maxLength)
            data.error = StringTemplate.format(this.maxLengthValidationErrorText, data.maxLength, data.value.length);
      }
   }
}


TextField.prototype.baseClass = "textfield";
TextField.prototype.reactOn = "input";
TextField.prototype.inputType = "text";
TextField.prototype.validationErrorText = 'The entered value is not valid.';
TextField.prototype.minLengthValidationErrorText = "Please enter {[{0}-{1}]} more character(s).";
TextField.prototype.maxLengthValidationErrorText = "The entered text is longer than the maximum allowed {0} characters.";
TextField.prototype.suppressErrorTooltipsUntilVisited = true;
TextField.prototype.icon = null;


class Input extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         visited: props.instance.data.visited
      }
   }

   shouldComponentUpdate(props, state) {
      return props.instance.shouldUpdate || state != this.state;
   }

   render() {
      var {data, widget} = this.props.instance;
      var {CSS, baseClass} = widget;

      var icon = widget.icon && (
         <div
            className={CSS.element(baseClass, 'tool')}
            onMouseDown={preventDefault}
            onClick={e => this.onChange(e, 'enter')}
         >
            {
               Icon.render(widget.icon, {className: CSS.element(baseClass, 'icon')})
            }
         </div>
      );

      return <div
         className={CSS.expand(data.classNames, CSS.state({visited: this.state.visited}))}
         style={data.style}
         onMouseDown={stopPropagation}
         onTouchStart={stopPropagation}>
         <input ref={el=> {
            this.input = el
         }}
                className={CSS.element(baseClass, 'input')}
                defaultValue={data.value}
                id={data.id}
                style={data.inputStyle}
                type={widget.inputType}
                disabled={data.disabled}
                readOnly={data.readOnly}
                placeholder={data.placeholder}
                onMouseMove={::this.onMouseMove}
                onMouseLeave={::this.onMouseLeave}
                onInput={ e => this.onChange(e, 'input') }
                onChange={ e => this.onChange(e, 'change') }
                onKeyDown={ ::this.onKeyDown }
                onBlur={ e => {
                   this.onChange(e, 'blur')
                } }
                onClick={stopPropagation}
         />
         {icon}
      </div>
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.instance.shouldUpdate !== false || this.state != nextState;
   }

   onMouseMove(e) {
      tooltipMouseMove(e, this.props.instance, this.state);
   }

   onMouseLeave(e) {
      tooltipMouseLeave(e, this.props.instance);
   }

   componentWillUnmount() {
      tooltipComponentWillUnmount(this.input);
   }

   componentDidMount() {
      tooltipComponentDidMount(this.input, this.props.instance, this.state);
      if (this.props.instance.data.autoFocus)
         this.input.focus();
   }


   onKeyDown(e) {
      switch (e.keyCode) {
         case KeyCode.enter:
            this.onChange(e, 'enter');
            break;

         case KeyCode.left:
         case KeyCode.right:
            e.stopPropagation();
            break;
      }
   }

   componentWillReceiveProps(props) {
      var {data} = props.instance;
      if (data.value != this.input.value)
         this.input.value = data.value || '';
      if (data.visited)
         this.setState({visited: true});
      tooltipComponentWillReceiveProps(this.input, props.instance, this.state);
   }

   onChange(e, change) {
      if (change == 'blur') {
         this.setState({visited: true});
      }

      let {instance} = this.props;
      let {widget, data} = instance;

      if (widget.reactOn.indexOf(change) != -1) {
         var value = e.target.value;
         if (data.maxLength != null && value.length > data.maxLength) {
            value = value.substring(0, data.maxLength);
            this.input.value = value;
         }
         instance.set('value', value || null);
      }
   }
}

Widget.alias('textfield', TextField)