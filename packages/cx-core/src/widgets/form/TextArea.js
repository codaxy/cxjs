import {Widget, VDOM} from '../../ui/Widget';
import {TextField} from './TextField';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../../util/eventCallbacks';
import {KeyCode} from 'cx/util';

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
TextArea.prototype.suppressErrorTooltipsUntilVisited = true;

class Input extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         visited: props.instance.data.visited
      }
   }

   render() {
      var {instance} = this.props;
      var {widget, data} = instance;
      var {CSS, baseClass} = widget;

      return <div className={CSS.expand(data.classNames, CSS.state({visited: this.state.visited}))}
                  style={data.style}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}>
         <textarea className={CSS.element(baseClass, 'input')}
                   ref={el=>{this.input = el}}
                   id={data.id}
                   rows={data.rows}
                   style={data.inputStyle}
                   defaultValue={data.value}
                   disabled={data.disabled}
                   readOnly={data.readOnly}
                   placeholder={data.placeholder}
                   onInput={ e => this.onChange(e, 'input') }
                   onChange={ e => this.onChange(e, 'change') }
                   onBlur={ e => { this.onChange(e, 'blur') } }
                   onClick={stopPropagation}
                   onMouseMove={e=>tooltipMouseMove(e, instance, this.state)}
                   onMouseLeave={e=>tooltipMouseLeave(e, instance)}
         />
      </div>
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextProps.instance.shouldUpdate !== false || this.state != nextState;
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
         this.setState({ visited: true });
      tooltipComponentWillReceiveProps(this.input, props.instance, this.state);
   }

   onChange(e, change) {
      if (change == 'blur')
         this.setState({visited: true});

      this.props.handleChange(e, change)
   }
}

Widget.alias('textarea', TextArea);