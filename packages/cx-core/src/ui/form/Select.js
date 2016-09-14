import {Widget, VDOM} from '../Widget';
import {HtmlElement} from '../HtmlElement';
import {Field} from './Field';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../eventCallbacks';

export class Select extends Field {

   declareData() {
      super.declareData({
         value: undefined,
         disabled: undefined,
         enabled: undefined,
         required: undefined
      }, ...arguments);
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

Widget.alias('select', Select)

class SelectComponent extends VDOM.Component {
   render() {
      var {multiple, select, instance} = this.props;
      var {data, widget} = instance;
      var {CSS, baseClass} = widget;

      return <div className={CSS.expand(data.classNames, CSS.state({visited: data.visited || this.state && this.state.visited}))}
                  style={data.style}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}>
         <select id={data.id}
                 ref={el=>{this.select = el}}
                 className={CSS.element(baseClass, 'select')}
                 style={data.inputStyle}
                 value={data.value || widget.nullString}
                 multiple={multiple}
                 disabled={data.disabled}
                 onBlur={::this.onBlur}
                 onChange={e=>{ e.preventDefault(); select(e.target.value); }}
                 onMouseMove={e=>tooltipMouseMove(e, instance, this.state)}
                 onMouseLeave={e=>tooltipMouseLeave(e, instance)}>
            {this.props.children}
         </select>
      </div>
   }

   onBlur() {
      this.setState({visited: true})
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