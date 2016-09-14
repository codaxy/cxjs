import {Widget, VDOM} from '../Widget';
import {Field} from './Field';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseEnter, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../eventCallbacks';

export class TextField extends Field {
   declareData() {
      super.declareData({
         value: null,
         disabled: undefined,
         readOnly: undefined,
         enabled: undefined,
         placeholder: undefined,
         required: undefined
      }, ...arguments);
   }

   renderInput(context, instance, key) {
      return <Input key={key}
                    instance={instance}
                    handleChange={(e, change) => this.handleChange(e, change, instance)}
      />
   }

   handleChange(e, change, instance) {
      if (this.reactOn.indexOf(change) != -1) {
         instance.set('value', e.target.value || null);
      }
   }

   validate(context, instance) {
      super.validate(context, instance);

      var {data} = instance;
      if (!data.error && this.validationRegExp)
         if (!this.validationRegExp.test(data.value))
            data.error = this.validationErrorText;
   }
}

TextField.prototype.baseClass = "textfield";
TextField.prototype.reactOn = "input";
TextField.prototype.inputType = "text";
TextField.prototype.validationErrorText = 'Entered value is not valid.';
TextField.prototype.suppressErrorTooltipsUntilVisited = true;

class Input extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         visited: props.instance.data.visited
      }
   }

   render() {
      var {data, widget} = this.props.instance;
      var {CSS, baseClass} = widget;
      return <div
         className={CSS.expand(data.classNames, CSS.state({visited: this.state.visited}))}
         style={data.style}
         onMouseDown={stopPropagation}
         onTouchStart={stopPropagation}>
         <input ref={el=>{this.input = el}}
                className={CSS.element(baseClass, 'input')}
                defaultValue={data.value}
                id={data.id}
                style={data.inputStyle}
                type={widget.inputType}
                disabled={data.disabled}
                readOnly={data.readOnly}
                placeholder={data.placeholder}
                onMouseEnter={::this.onMouseEnter}
                onMouseLeave={::this.onMouseLeave}
                onInput={ e => this.onChange(e, 'input') }
                onChange={ e => this.onChange(e, 'change') }
                onKeyDown={ ::this.onKeyDown }
                onBlur={ e => {
                   this.onChange(e, 'blur')
                } }
                onClick={stopPropagation}
         />
      </div>
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.instance.shouldUpdate !== false || this.state != nextState;
   }

   onMouseEnter(e) {      
      tooltipMouseEnter(e, this.props.instance, this.state);
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
         case 13:
            this.onChange(e, 'enter');
            break;

         case 37:
         case 39:
            e.stopPropagation();
            break;
      }
   }

   componentWillReceiveProps(props) {
      var {data} = props.instance;
      if (data.value != this.input.value)
         this.input.value = data.value || '';
      if (data.visited)
         this.setState({ visited: true });
      tooltipComponentWillReceiveProps(this.input, props.instance, this.state);
   }

   onChange(e, change) {
      if (change == 'blur') {
         this.setState({visited: true});
      }

      this.props.handleChange(e, change)
   }
}

Widget.alias('textfield', TextField)