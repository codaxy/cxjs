import {Widget, VDOM, getContent} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';
import {Field, getFieldTooltip} from './Field';
import {tooltipParentWillReceiveProps, tooltipParentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipParentDidMount} from '../overlay/Tooltip';
import {stopPropagation, preventDefault} from '../../util/eventCallbacks';
import DropdownIcon from '../icons/drop-down';
import ClearIcon from '../icons/clear';
import {Icon} from '../Icon';
import {Localization} from '../../ui/Localization';

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

   init() {
      if (typeof this.hideClear != 'undefined')
         this.showClear = !this.hideClear;

      super.init();
   }

   renderInput(context, instance, key) {
      return <SelectComponent key={key}
                              instance={instance}
                              multiple={this.multiple}
                              select={v => this.select(v, instance)}
                              label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
                              help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}>
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
Select.prototype.suppressErrorsUntilVisited = true;
Select.prototype.showClear = true;
Select.prototype.icon = null;

Widget.alias('select', Select);
Localization.registerPrototype("cx/widgets/Select", Select);

class SelectComponent extends VDOM.Component {

   constructor(props){
      super(props);
      this.state = {
         visited: false,
         focus: false
      }
   }

   render() {
      let {multiple, select, instance, label, help} = this.props;
      let {data, widget} = instance;
      let {CSS, baseClass} = widget;

      let icon = widget.icon && (
            <div className={CSS.element(baseClass, 'left-icon')}>
               {
                  Icon.render(widget.icon, {className: CSS.element(baseClass, 'icon')})
               }
            </div>
         );

      let insideButton, readOnly = data.disabled || data.readOnly;

      if (widget.showClear && !readOnly && !this.props.multiple && !data.required && data.placeholder && data.value != null) {
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
         className={CSS.expand(data.classNames, CSS.state({
            visited: data.visited || this.state && this.state.visited,
            icon: widget.icon,
            focus: this.state.focus
         }))}
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
            onFocus={ e=> this.onFocus() }
            onChange={e => {
               e.preventDefault();
               select(e.target.value);
            }}
            onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(instance, this.state))}
            onMouseLeave={e => tooltipMouseLeave(e, ...getFieldTooltip(instance, this.state))}
         >
            {placeholder}
            {this.props.children}
         </select>
         { insideButton }
         { icon }
         { label }
         { help }
      </div>
   }

   onBlur() {
      this.setState({visited: true});
      if (this.state.focus)
         this.setState({
            focus: false
         });
   }

   onFocus(){
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true
         });
      }
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
      tooltipParentDidMount(this.select, ...getFieldTooltip(this.props.instance, this.state));
      if (this.props.instance.data.autoFocus)
         this.select.focus();
   }

   componentWillReceiveProps(props) {
      tooltipParentWillReceiveProps(this.select, ...getFieldTooltip(props.instance, this.state));
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