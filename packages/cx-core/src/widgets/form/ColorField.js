import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Field} from './Field';
import {Dropdown} from '../overlay/Dropdown';
import {ColorPicker} from './ColorPicker';
import {parseColor} from '../../util/color/parseColor';
import {isTouchDevice} from '../../util/isTouchDevice';
import {isTouchEvent} from '../../util/isTouchEvent';

import {
   tooltipComponentWillReceiveProps,
   tooltipComponentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipComponentDidMount
} from '../overlay/Tooltip';
import {stopPropagation} from '../../util/eventCallbacks';
import {KeyCode} from '../../util';

export class ColorField extends Field {

   declareData() {
      super.declareData({
         value: undefined,
         disabled: undefined,
         readOnly: undefined,
         enabled: undefined,
         placeholder: undefined,
         required: undefined
      }, ...arguments);
   }

   prepareData(context, {data}) {
      super.prepareData(...arguments);
   }

   renderInput(context, instance, key) {
      return <ColorInput key={key}
         instance={instance}
         picker={{
            value: this.value,
            format: this.format
         }}
      />
   }
}

ColorField.prototype.baseClass = "colorfield";
ColorField.prototype.format = 'rgba';
ColorField.prototype.suppressErrorTooltipsUntilVisited = true;

Widget.alias('color-field', ColorField);

class ColorInput extends VDOM.Component {

   constructor(props) {
      super(props);
      let {data} = this.props.instance;
      this.data = data;
      this.state = {
         dropdownOpen: false,
         visited: data.visited
      };
   }

   getDropdown() {
      if (this.dropdown)
         return this.dropdown;

      let dropdown = {
         type: Dropdown,
         relatedElement: this.input,
         scrollTracking: true,
         autoFocus: true,
         focusable: isTouchDevice(), //put focus on the dropdown to prevent opening the keyboard
         inline: true,
         touchFriendly: true,
         placementOrder: ' down down-left down-right up up-left up-right right right-up right-down left left-up left-down',
         items: {
            type: ColorPicker,
            ...this.props.picker,
            onColorClick: (e) => {
               e.stopPropagation();
               e.preventDefault();
               let touch = isTouchEvent(e);
               this.closeDropdown(e, () => {
                  if (!touch)
                     this.input.focus();
               });
            }
         },
         onFocusOut: () => {
            this.closeDropdown();
         },
         firstChildDefinesHeight: true,
         firstChildDefinesWidth: true
      };

      return this.dropdown = Widget.create(dropdown);
   }

   render() {
      let {instance} = this.props;
      let {data, store, widget} = instance;
      let {CSS, baseClass} = widget;

      let insideButton = <div className={CSS.element(baseClass, 'tool')}>
         <div style={{backgroundColor: data.value}}></div>
      </div>;

      let dropdown = false;
      if (this.state.dropdownOpen)
         dropdown = instance.prepareRenderCleanupChild(this.getDropdown(), store, 'dropdown', {name: 'colorfield-dropdown'});

      return <div
         className={CSS.expand(data.classNames, CSS.state({visited: data.visited || this.state && this.state.visited}))}
         style={data.style}
         onMouseDown={::this.onMouseDown}
         onTouchStart={::this.onMouseDown}
         onClick={stopPropagation}>
         <input
            id={data.id}
            ref={el => {
               this.input = el
            }}
            type="text"
            className={CSS.element(baseClass, 'input')}
            style={data.inputStyle}
            defaultValue={data.value}
            disabled={data.disabled}
            readOnly={data.readOnly}
            placeholder={data.placeholder}
            {...data.inputAttrs}
            onInput={ e => this.onChange(e, 'input') }
            onChange={ e => this.onChange(e, 'change') }
            onKeyDown={ e => this.onKeyDown(e) }
            onBlur={ e => {
               this.onBlur(e)
            } }
            onFocus={ e => {
               this.onFocus(e)
            } }
            onMouseMove={e => tooltipMouseMove(e, instance, this.state)}
            onMouseLeave={e => tooltipMouseLeave(e, instance, this.state)}
         />
         { insideButton }
         { dropdown }
      </div>;
   }

   onMouseDown(e) {
      e.stopPropagation();
      if (this.state.dropdownOpen)
         this.closeDropdown(e);
      else {
         this.openDropdownOnFocus = true;
      }

      //icon click
      if (e.target != this.input) {
         e.preventDefault();
         if (!this.state.dropdownOpen)
            this.openDropdown(e);
         else
            this.input.focus();
      }
   }

   onFocus(e) {
      if (this.openDropdownOnFocus)
         this.openDropdown(e);
   }

   onKeyDown(e) {

      switch (e.keyCode) {
         case KeyCode.enter:
            e.stopPropagation();
            this.onChange(e, 'enter');
            break;

         case KeyCode.esc:
            if (this.state.dropdownOpen) {
               e.stopPropagation();
               this.closeDropdown(e, () => {
                  this.input.focus();
               });
            }
            break;

         case KeyCode.left:
         case KeyCode.right:
            e.stopPropagation();
            break;

         case KeyCode.down:
            this.openDropdown(e);
            e.stopPropagation();
            e.preventDefault();
            break;
      }
   }

   onBlur(e) {
      this.onChange(e, 'blur');
   }

   closeDropdown(e, callback) {
      if (this.state.dropdownOpen) {
         if (this.scrollableParents)
            this.scrollableParents.forEach(el => {
               el.removeEventListener('scroll', this.updateDropdownPosition)
            });

         this.setState({dropdownOpen: false}, callback);
      }
      else if (callback)
         callback();
   }

   openDropdown(e) {
      let {data} = this.props.instance;
      this.openDropdownOnFocus = false;

      if (!this.state.dropdownOpen && !(data.disabled || data.readOnly)) {
         this.setState({dropdownOpen: true});
      }
   }

   componentWillReceiveProps(props) {
      let {data, state} = props.instance;
      if (data.value != this.input.value && (this.data.value != data.value || !state.inputError)) {
         this.input.value = data.value || '';
         props.instance.setState({
            inputError: false
         })
      }
      this.data = data;

      if (data.visited)
         this.setState({visited: true});

      tooltipComponentWillReceiveProps(this.input, this.props.instance, this.state);
   }

   componentDidMount() {
      tooltipComponentDidMount(this.input, this.props.instance, this.state);
      if (this.props.instance.widget.autoFocus && !isTouchDevice())
         this.input.focus();
   }

   componentWillUnmount() {
      tooltipComponentWillUnmount(this.input);
   }

   onChange(e, eventType) {

      if (eventType == 'blur')
         this.setState({visited: true});

      let value = e.target.value;
      let isValid;
      try {
         parseColor(value);
         isValid = true;
      }
      catch (e) {
         isValid = false;
      }

      let {instance} = this.props;

      if (eventType == 'blur' || eventType == 'enter') {

         if (isValid)
            instance.set('value', value);

         instance.setState({
            inputError: !isValid && 'Invalid color entered.'
         });
      }
   }
}
