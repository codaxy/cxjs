import {Widget, VDOM, getContent} from '../../ui/Widget';
import {TextField} from './TextField';
import {getFieldTooltip, autoFocus} from './Field';
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount
} from '../overlay/tooltip-ops';
import {stopPropagation} from '../../util/eventCallbacks';
import {KeyCode} from '../../util';
import {isTouchDevice} from '../../util';

export class TextArea extends TextField {

   declareData() {
      super.declareData({
         rows: undefined
      }, ...arguments);
   }

   renderInput(context, instance, key) {
      return <Input key={key}
         data={instance.data}
         instance={instance}
         handleChange={(e, change) => this.handleChange(e, change, instance)}
         label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
         help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
      />
   }

   handleChange(e, change, instance) {
      if (this.reactOn.indexOf(change) != -1) {
         instance.set('value', e.target.value || null);
      }
   }
}

TextArea.prototype.baseClass = "textarea";
TextArea.prototype.reactOn = "blur";
TextArea.prototype.suppressErrorsUntilVisited = true;

class Input extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         focus: false
      }
   }

   render() {
      let {instance, label, help} = this.props;
      let {widget, data, state} = instance;
      let {CSS, baseClass, suppressErrorsUntilVisited} = widget;

      let empty = this.input ? !this.input.value : data.empty;

      return <div
         className={CSS.expand(data.classNames, CSS.state({
            visited: state.visited,
            focus: this.state.focus,
            empty: empty && !data.placeholder,
            error: data.error && (state.visited || !suppressErrorsUntilVisited || !empty)
         }))}
         style={data.style}
         onMouseDown={stopPropagation}
         onTouchStart={stopPropagation}
      >
         <textarea className={CSS.element(baseClass, 'input')}
            ref={el => {
               this.input = el
            }}
            id={data.id}
            rows={data.rows}
            style={data.inputStyle}
            defaultValue={data.value}
            disabled={data.disabled}
            readOnly={data.readOnly}
            placeholder={data.placeholder}
            {...data.inputAttrs}
            onInput={ e => this.onChange(e, 'input') }
            onChange={ e => this.onChange(e, 'change') }
            onBlur={ e => {
               this.onChange(e, 'blur')
            } }
            onFocus={ e => this.onFocus() }
            onClick={stopPropagation}
            onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(instance))}
            onMouseLeave={e => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
         />
         {label}
         {help}
      </div>
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.instance.shouldUpdate !== false || this.state != nextState;
   }

   componentWillUnmount() {
      tooltipParentWillUnmount(this.props.instance);
   }

   componentDidMount() {
      tooltipParentDidMount(this.input, ...getFieldTooltip(this.props.instance));
      autoFocus(this.input, this);
   }

   componentDidUpdate() {
      autoFocus(this.input, this);
   }

   onKeyDown(e) {
      let {instance} = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false)
         return;

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
      let {data} = props.instance;
      if (data.value != this.input.value)
         this.input.value = data.value || '';
      tooltipParentWillReceiveProps(this.input, ...getFieldTooltip(props.instance));
   }

   onChange(e, change) {
      if (change == 'blur')
         this.props.instance.setState({visited: true});
      if (this.state.focus)
         this.setState({
            focus: false
         });
      this.props.handleChange(e, change)
   }

   onFocus() {
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true
         });
      }
   }
}

Widget.alias('textarea', TextArea);