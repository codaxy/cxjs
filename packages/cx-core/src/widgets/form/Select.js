import {Widget, VDOM} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';
import {Field} from './Field';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation, preventDefault} from '../../util/eventCallbacks';
import DropdownIcon from '../icons/drop-down';
import ClearIcon from '../icons/clear';

export class Select extends Field {

   declareData() {
      super.declareData({
         value: undefined,
         disabled: undefined,
         enabled: undefined,
         required: undefined,
         placeholder: undefined
      }, ...arguments);
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         empty: data.value == null
      };
      return super.prepareData(context, instance);
   }

   renderInput(context, instance, key) {
      return <SelectComponent key={key}
                              instance={instance}
                              multiple={this.multiple}
                              select={v => this.select(v, instance)}>
         {this.renderChildren(context, instance)}
      </SelectComponent>
   }

   convert(value) {
      if (value == this.nullString)
         return null;
      if (value == 'true')
         return true;
      if (value == 'false')
         return false;
      if (value.match(/^\d+(\.\d+)?$/))
         return Number(value);
      return value;
   }

   select(value, instance) {
      if (this.convertValues && value != null)
         value = this.convert(value);
      instance.set('value', value);
   }

   add(item) {
      if (typeof item == 'string')
         return;
      super.add(item);
   }
}

Select.prototype.baseClass = "select";
Select.prototype.multiple = false;
Select.prototype.convertValues = true;
Select.prototype.nullString = '';
Select.prototype.suppressErrorTooltipsUntilVisited = true;
Select.prototype.hideClear = false;

Widget.alias('select', Select)

class SelectComponent extends VDOM.Component {
   render() {
      let {multiple, select, instance} = this.props;
      let {data, widget} = instance;
      let {CSS, baseClass} = widget;

      let insideButton, readOnly = data.disabled || data.readOnly;

      if (!widget.hideClear && !readOnly && !this.props.multiple && !data.required && data.placeholder && data.value != null) {
         insideButton = (
            <div onMouseDown={preventDefault}
               onClick={e => this.onClearClick(e)}
               className={CSS.element(baseClass, 'clear')}>
               <ClearIcon className={CSS.element(baseClass, 'icon')}/>
            </div>
         )
      }
      else {
         insideButton = (
            <div className={CSS.element(baseClass, 'tool')}>
               <DropdownIcon className={CSS.element(baseClass, 'icon')}/>
            </div>
         );
      }

      let placeholder;
      if (data.placeholder) {
         placeholder = <option
            value={widget.nullString}
            className={CSS.element(baseClass, 'placeholder')}
            disabled
            hidden
         >
            {data.placeholder}
         </option>
      }

      return <div
         className={CSS.expand(data.classNames, CSS.state({visited: data.visited || this.state && this.state.visited}))}
         style={data.style}
         onMouseDown={stopPropagation}
         onTouchStart={stopPropagation}
      >
         <select id={data.id}
            ref={el => {
               this.select = el
            }}
            className={CSS.element(baseClass, 'select')}
            style={data.inputStyle}
            value={data.value || widget.nullString}
            multiple={multiple}
            disabled={data.disabled}
            {...data.inputAttrs}
            onBlur={::this.onBlur}
            onChange={e => {
               e.preventDefault();
               select(e.target.value);
            }}
            onMouseMove={e => tooltipMouseMove(e, instance, this.state)}
            onMouseLeave={e => tooltipMouseLeave(e, instance)}
         >
            {placeholder}
            {this.props.children}
         </select>
         {insideButton}
      </div>
   }

   onBlur() {
      this.setState({visited: true})
   }

   onClearClick(e) {
      e.preventDefault();
      e.stopPropagation();
      let {instance} = this.props;
      let {widget} = instance;
      instance.set('value', widget.emptyValue);
   }

   componentDidMount() {
      var { select } = this.props;
      select(this.select.value);
      tooltipComponentDidMount(this.select, this.props.instance, this.state);
      if (this.props.instance.data.autoFocus)
         this.select.focus();
   }

   componentWillReceiveProps(props) {
      tooltipComponentWillReceiveProps(this.select, props.instance, this.state);
   }
}

export class Option extends HtmlElement {

   declareData() {
      super.declareData({
         value: undefined,
         disabled: undefined,
         enabled: undefined,
         selected: undefined,
         text: undefined
      }, ...arguments);
   }

   prepareData(context, {data}) {
      super.prepareData(...arguments);
      if (data.value != null)
         data.value = data.value.toString();
   }

   render(context, instance, key) {
      var {data} = instance;
      return <option key={key} value={data.value}>
         {data.text || this.renderChildren(context, instance)}
      </option>
   }
}

Widget.alias('option', Option)