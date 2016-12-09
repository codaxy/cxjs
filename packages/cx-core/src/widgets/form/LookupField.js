import {Widget, VDOM} from '../../ui/Widget';
import {Field} from './Field';
import {Text} from '../Text';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {Repeater} from '../Repeater';
import {HtmlElement} from '../HtmlElement';
import {Binding} from '../../data/Binding';
import {Console} from '../../util/Console';
import {Dropdown} from '../overlay/Dropdown';
import {FocusManager} from '../../ui/FocusManager';
import {isFocused} from '../../util/DOM';
import {isTouchDevice} from '../../util/isTouchDevice';
import {tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseMove, tooltipMouseLeave, tooltipComponentDidMount} from '../overlay/Tooltip';
import {stopPropagation} from '../../util/eventCallbacks';
import ClearIcon from '../../icons/clear';

export class LookupField extends Field {

   declareData() {
      var additionalAttributes = this.multiple
         ? {values: undefined, records:undefined}
         : {value: undefined, text: undefined};

      super.declareData({
         disabled: undefined,
         enabled: undefined,
         placeholder: undefined,
         required: undefined,
         options: undefined
      }, additionalAttributes, ...arguments);
   }

   init() {

      if (!this.bindings) {
         var b = [];
         if (this.value && this.value.bind)
            b.push({
               key: true,
               local: this.value.bind,
               remote: `$option.${this.optionIdField}`
            });

         if (this.text && this.text.bind)
            b.push({
               local: this.text.bind,
               remote: `$option.${this.optionTextField}`
            });
         this.bindings = b;
      }

      if (this.bindings.length==0 && this.multiple)
         this.bindings = [{
            key: true,
            local: `$value.${this.valueIdField}`,
            remote: `$option.${this.optionIdField}`
         }, {
            local: `$value.${this.valueTextField}`,
            remote: `$option.${this.optionTextField}`
         }];

      this.keyBindings = this.bindings.filter(b=>b.key);

      if (!this.items && !this.children)
         this.items = {
            $type: Text,
            bind: `$option.${this.optionTextField}`
         };

      this.itemConfig = this.children || this.items;

      delete this.items;
      delete this.children;

      super.init();
   }

   prepareData(context, instance) {
      var {data, store} = instance;

      data.stateMods = {
         multiple: this.multiple,
         disabled: data.disabled
      };

      super.prepareData(context, instance);

      data.selectedKeys = [];

      if (this.multiple) {

         if (Array.isArray(data.values) && Array.isArray(data.options)) {
            data.selectedKeys = data.values.map(v=>this.keyBindings.length == 1 ? [v] : v);
            var map = {};
            data.options.filter($option => {
               var optionKey = getOptionKey(this.keyBindings, {$option});
               for (var i = 0; i < data.selectedKeys.length; i++)
                  if (areKeysEqual(optionKey, data.selectedKeys[i])) {
                     map[i] = convertOption(this.bindings, {$option});
                     break;
                  }
            });
            data.records = [];
            for (var i = 0; i < data.selectedKeys.length; i++)
               if (map[i])
                  data.records.push(map[i]);
         }
         else if (Array.isArray(data.records))
            data.selectedKeys.push(...data.records.map($value=>this.keyBindings.map(b=>Binding.get(b.local).value({$value}))))
      } else {
         var dataViewData = store.getData();
         data.selectedKeys.push(this.keyBindings.map(b=>Binding.get(b.local).value(dataViewData)));
         if (!this.text && Array.isArray(data.options)) {
            var option = data.options.find($option=>areKeysEqual(getOptionKey(this.keyBindings, {$option}), data.selectedKeys[0]));
            data.text = option && option[this.optionTextField] || '';
         }
      }
   }

   renderInput(context, instance, key) {
      return <LookupComponent key={key}
                              multiple={this.multiple}
                              instance={instance}
                              itemConfig={this.itemConfig}
                              bindings={this.bindings}
                              baseClass={this.baseClass}
                              onQuery={this.onQuery}
         />
   }

   filterOptions(instance, options, query) {
      if (!query)
         return options;
      var checks = query.split(' ').map(w=>new RegExp(w, 'gi'));
      return options.filter(o=>typeof o[this.optionTextField] == 'string' && checks.every(ex=>o[this.optionTextField].match(ex)));
   }
}

LookupField.prototype.baseClass = "lookupfield";
LookupField.prototype.memoize = false;
LookupField.prototype.multiple = false;
LookupField.prototype.queryDelay = 150;
LookupField.prototype.minQueryLength = 0;
LookupField.prototype.hideSearchField = false;
LookupField.prototype.minOptionsForSearchField = 7;
LookupField.prototype.loadingText = 'Loading...';
LookupField.prototype.queryErrorText = 'Error occurred while querying for lookup data.';
LookupField.prototype.noResultsText = 'No results found matching the given criteria.';
LookupField.prototype.optionIdField = 'id';
LookupField.prototype.optionTextField = 'text';
LookupField.prototype.valueIdField = 'id';
LookupField.prototype.valueTextField = 'text';
LookupField.prototype.suppressErrorTooltipsUntilVisited = true;

Widget.alias('lookupfield', LookupField)

function getOptionKey(bindings, data) {
   return bindings
      .filter(a=>a.key)
      .map(b=>Binding.get(b.remote).value(data));
}

function areKeysEqual(key1, key2) {
   if (!key1 || !key2 || key1.length != key2.length)
      return false;

   for (var i = 0; i<key1.length; i++)
      if (key1[i] != key2[i])
         return false;

   return true;
}

function convertOption(bindings, data) {
   var result = {$value: {}};
   bindings.forEach(b=> {
      var value = Binding.get(b.remote).value(data);
      result = Binding.get(b.local).set(result, value);
   });
   return result.$value;
}

class LookupComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      var {data, store} = this.props.instance;
      this.dom = {};
      this.state = {
         options: [],
         formatted: data.formatted,
         value: data.formatted,
         dropdownOpen: false,
         cursorKey: null,
         visited: data.visited
      };

      this.itemStore = new ReadOnlyDataView({
         store: store
      });
   }

   getOptionKey(data) {
      return this.props.bindings
         .filter(a=>a.key)
         .map(b=>Binding.get(b.remote).value(data));
   }

   getLocalKey(data) {
      return this.props.bindings
         .filter(a=>a.key)
         .map(b=>Binding.get(b.local).value(data));
   }

   areKeysEqual(key1, key2) {
      if (!key1 || !key2 || key1.length != key2.length)
         return false;

      for (var i = 0; i<key1.length; i++)
         if (key1[i] != key2[i])
            return false;

      return true;
   }

   findOption(options, key) {
      if (!key)
         return -1;
      for (var i = 0; i < options.length; i++) {
         var optionKey = this.getOptionKey({ $option: options[i]});
         if (this.areKeysEqual(key, optionKey))
            return i;
      }
      return -1;
   }

   setCursorKey(itemData) {
      var key = this.getOptionKey(itemData);
      this.setState({
         cursorKey: key
      });
   }

   suggestCursorKey(options) {
      var index = this.findOption(options, this.state.cursorKey);
      if (index != -1)
         return this.state.cursorKey;

      var {data, store} = this.props.instance;
      var dataViewData = store.getData();
      if (data.value) {
         var valueKey = this.props.bindings
            .filter(a=>a.key)
            .map(b=>Binding.get(b.local).value(dataViewData));
         index = this.findOption(options, valueKey);
         if (index != -1)
            return valueKey;
      }

      if (options.length > 0)
         return this.getOptionKey({option: options[0]});

      return null;
   }

   getDropdown() {
      if (this.dropdown)
         return this.dropdown;

      var {widget} = this.props.instance;
      var {CSS, baseClass} = widget;

      this.list = Widget.create(<cx>
         <ul class={CSS.element(baseClass, "lookup-options")}>
            <Repeater records:bind="$options" recordName="$option">
               <li data-option:bind="$option"
                   memoize={false}
                   class={{
                      selected: (data) => this.props.instance.data.selectedKeys.find(x=>this.areKeysEqual(x, this.getOptionKey(data))) != null,
                      cursor: (data) => this.areKeysEqual(this.getOptionKey(data), this.state.cursorKey)
                   }}
                   children={this.props.itemConfig}
                   onMouseDown={e => {
                      e.preventDefault();
                   }}
                   onMouseEnter={(e, {store}) => {
                      this.setCursorKey(store.getData())
                   }}
                   onClick={(e, inst) => this.onItemClick(e, inst)}
               />
            </Repeater>
         </ul>
      </cx>);

      var dropdown = {
         type: Dropdown,
         relatedElement: this.dom.input,
         scrollTracking: true,
         inline: true,
         renderChildren: ::this.renderDropdownContents,
         onFocusOut: ::this.closeDropdown,
         memoize: false,
         constrain: true,
         placementOrder: 'down-right down-left up-right up-left',
         touchFriendly: isTouchDevice(),
         onMeasureDropdownNaturalSize: () => {
            if (this.dom.dropdown && this.dom.list) {
               return {
                  height: this.dom.dropdown.offsetHeight + this.dom.list.scrollHeight - this.dom.list.offsetHeight
               }
            }
         },
         ...widget.dropdownOptions
      };

      return this.dropdown = Widget.create(dropdown);
   }

   renderDropdownContents() {
      var content;
      var {instance} = this.props;
      var {data, widget} = instance;
      var {CSS, baseClass} = widget;

      var searchVisible = !widget.hideSearchField && (!Array.isArray(data.options) ||
         (widget.minOptionsForSearchField && data.options.length >= widget.minOptionsForSearchField))

      if (this.state.status == "loading") {
         content = <div key="msg" className={CSS.element(baseClass, "message", "loading")}>
            {widget.loadingText}
         </div>
      }
      else if (this.state.status == "error") {
         content = <div key="msg" className={CSS.element(baseClass, "message", "error")}>
            {widget.queryErrorText}
         </div>
      }
      else if (this.state.status == "info") {
         content = <div key="msg" className={CSS.element(baseClass, "message", "info")}>
            {this.state.message}
         </div>
      }
      else if (this.state.options.length == 0) {
         content = <div key="msg" className={CSS.element(baseClass, "message", "no-results")}>
            {widget.noResultsText}
         </div>
      }
      else {
         content = <div key="msg" ref={el=>{this.dom.list = el}}
                        className={CSS.element(baseClass, "scroll-container")}
                        onWheel={::this.onListWheel}>
            {instance.prepareRenderCleanupChild(this.list, this.itemStore, "list", {name: 'lookupfield-list'})}
         </div>
      }

      return <div ref={el=>{this.dom.dropdown = el}}
                  className={CSS.element(baseClass, 'dropdown')}
                  tabIndex={0}
                  onFocus={::this.onDropdownFocus}
                  onKeyDown={e=>this.onDropdownKeyPress(e)}>
         {searchVisible && <input key="query" ref={el=>{this.dom.query = el}} type="text"
                                  className={CSS.element(baseClass, "query")}
                                  onClick={e=>{e.preventDefault();e.stopPropagation()}}
                                  onChange={e=>this.query(e.target.value)}
                                  onBlur={e=>this.onQueryBlur(e)}/>}
         {content}
      </div>
   }

   onListWheel(e) {
      var {list} = this.dom;
      if ((list.scrollTop + list.offsetHeight == list.scrollHeight && e.deltaY > 0) ||
         (list.scrollTop == 0 && e.deltaY < 0)) {
         e.preventDefault();
         e.stopPropagation();
      }
   }

   onDropdownFocus(e) {
      if (this.dom.query && !isFocused(this.dom.query) && !isTouchDevice())
         FocusManager.focus(this.dom.query);
   }

   getPlaceholder(text) {

      var {CSS, baseClass} = this.props.instance.widget;

      if (text)
         return <span className={CSS.element(baseClass, "placeholder")}>{text}</span>;

      return <span className={CSS.element(baseClass, "placeholder")}>&nbsp;</span>;
   }

   render() {
      var {instance} = this.props;
      var {data, widget} = instance;
      var {CSS, baseClass} = widget;

      var dropdown;
      if (this.state.dropdownOpen) {
         this.itemStore.setData({
            $options: this.state.options
         });
         dropdown = instance.prepareRenderCleanupChild(this.getDropdown(), this.itemStore, "dropdown", {name: 'lookupfield-dropdown'});
      }

      var readOnly = data.disabled || data.readOnly;

      var insideButton = !readOnly && !this.props.multiple && !data.required && data.value != null && (
         <div onMouseDown={e=>{e.preventDefault()}}
              onClick={e=>this.onClearClick(e)}
              className={CSS.element(baseClass, 'clear')}>
            <ClearIcon className={CSS.element(baseClass, 'icon')} />
         </div>
      );

      var text;

      if (this.props.multiple) {
         if (Array.isArray(data.records) && data.records.length > 0) {
            text = data.records.map((v, i)=><div key={i} className={CSS.element(baseClass, 'tag')}>
               <span className={CSS.element(baseClass, 'tag-value')}>{v[widget.valueTextField]}</span>
               {!readOnly && (
                  <div className={CSS.element(baseClass, 'tag-clear')}
                     onMouseDown={e=>{e.preventDefault(); e.stopPropagation();}}
                     onClick={e=>this.onClearClick(e, v)}>
                     <ClearIcon className={CSS.element(baseClass, 'icon')} />
                  </div>
               )}
            </div>);
         } else {
            text = this.getPlaceholder(data.placeholder);
         }
      } else {
         text = data.value != null ? data.text || this.getPlaceholder() : this.getPlaceholder(data.placeholder);
      }

      var states = {
         visited: data.visited || this.state && this.state.visited,
         icon: !insideButton
      };

      return <div className={CSS.expand(data.classNames, CSS.state(states))}
                  style={data.style}
                  onMouseDown={stopPropagation}
                  onTouchStart={stopPropagation}>
         <div id={data.id}
              className={CSS.element(widget.baseClass, "input")}
              tabIndex={data.disabled ? null : 0}
              ref={el=>{this.dom.input = el}}
              onMouseMove={e=>tooltipMouseMove(e, this.props.instance, this.state)}
              onMouseLeave={e=>tooltipMouseLeave(e, this.props.instance)}
              onClick={ e=> this.onClick(e) }
              onInput={ e => this.onChange(e, 'input') }
              onChange={ e => this.onChange(e, 'change') }
              onKeyDown={ e => this.onKeyDown(e) }
              onMouseDown={ e => this.onMouseDown(e) }
              onBlur={ e => this.onBlur(e) }
              onFocus={ e => this.onFocus(e) }>
            {text}
         </div>
         { insideButton }
         { dropdown }
      </div>;
   }

   onClick(e) {
      e.stopPropagation();
      e.preventDefault();
      this.openDropdown(e);
   }

   onItemClick(e, {store}) {
      this.select(e, store.getData());
      e.stopPropagation();
      e.preventDefault();
   }

   onClearClick(e, value) {
      var {instance} = this.props;
      var {data, store, widget} = instance;
      var {keyBindings} = widget;
      e.stopPropagation();
      e.preventDefault();
      if (widget.multiple) {
         if (Array.isArray(data.records)) {
            var itemKey = this.getLocalKey({$value: value});
            var newRecords = data.records.filter(v=>!this.areKeysEqual(this.getLocalKey({$value: v}), itemKey));

            instance.set('records', newRecords);

            var newValues = newRecords.map(rec=>this.getLocalKey({$value: rec}))
                                      .map(k=>keyBindings.length == 1 ? k[0] : k);

            instance.set('values', newValues);
         }
      } else {
         this.props.bindings.forEach(b=> {
            store.set(b.local, null);
         });
      }
      this.dom.input.focus();
   }

   select(e, itemData) {
      var {instance} = this.props;
      var {store, data, widget} = instance;
      var {bindings, keyBindings} = widget;

      if (widget.multiple) {
         var {selectedKeys, records} = data;

         var optionKey = this.getOptionKey(itemData);
         var newRecords = records;
         if (!selectedKeys.find(k=>this.areKeysEqual(optionKey, k))) {
            var valueData = {
               $value: {}
            };
            bindings.forEach(b=> {
               valueData = Binding.get(b.local).set(valueData, Binding.get(b.remote).value(itemData));
            });
            newRecords = [...records || [], valueData.$value];
         } else {
            newRecords = records.filter(v=>!this.areKeysEqual(optionKey, this.getLocalKey({$value: v})));
         }

         instance.set('records', newRecords);

         var newValues = newRecords.map(rec=>this.getLocalKey({$value: rec}))
                                   .map(k=>keyBindings.length == 1 ? k[0] : k);

         instance.set('values', newValues);
      }
      else {
         bindings.forEach(b=> {
            store.set(b.local, Binding.get(b.remote).value(itemData));
         });
      }
      this.closeDropdown(e);
      this.dom.input.focus();
   }

   onDropdownKeyPress(e) {
      if (e.keyCode == 13) { //enter
         var index = this.findOption(this.state.options, this.state.cursorKey);
         var itemData = {
            $option: this.state.options[index]
         }
         this.select(e, itemData);
      }

      if (e.keyCode == 27) { //esc
         this.closeDropdown(e);
         this.dom.input.focus();
      }

      if (e.keyCode == 38) { //up
         var index = this.findOption(this.state.options, this.state.cursorKey);
         if (index > 0) {
            this.setCursorKey({
               $option: this.state.options[index - 1]
            })
         }
         e.preventDefault();
         e.stopPropagation();
      }

      if (e.keyCode == 40) { //down
         var index = this.findOption(this.state.options, this.state.cursorKey);
         if (index + 1 < this.state.options.length) {
            this.setCursorKey({
               $option: this.state.options[index + 1]
            })
         }
         e.preventDefault();
         e.stopPropagation();
      }
   }

   onKeyDown(e) {

      switch (e.keyCode) {
         case 46:
            this.onClearClick(e);
            return;

         case 16: //shift
         case 17: //ctrl
         case 9: //tab
            break;

         default:
            this.openDropdown(e);
            break;
      }
   }

   onMouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
      this.openDropdown(e);
   }

   onQueryBlur(e) {
      FocusManager.nudge();
   }

   onFocus(e) {

   }

   onBlur(e) {
      if (!this.state.dropdownOpen)
         this.setState({visited: true});
   }

   closeDropdown(e) {
      if (this.state.dropdownOpen)
         this.setState({
            dropdownOpen: false,
            cursorKey: null,
            visited: true
         });
   }

   openDropdown(e) {
      var {data} = this.props.instance;
      if (!this.state.dropdownOpen && !data.disabled && !data.readOnly) {
         this.query('');
         this.setState({
            dropdownOpen: true,
         }, () => {
            this.dom.dropdown.focus();
         });
      }
   }

   query(q) {
      var {widget, data} = this.props.instance;

      if (this.queryTimeoutId)
         clearTimeout(this.queryTimeoutId);

      if (q.length < widget.minQueryLength) {
         this.setState({
            status: "info",
            message: `Please type in at least ${widget.minQueryLength} character(s) to start the search.`
         });
         return;
      }

      if (Array.isArray(data.options)) {
         var results = widget.filterOptions(this.props.instance, data.options, q);
         this.setState({
            options: results,
            cursorKey: this.suggestCursorKey(results),
            status: "loaded"
         });
      }

      if (this.props.onQuery) {
         this.setState({
            status: "loading"
         });

         this.queryTimeoutId = setTimeout(()=> {
            delete this.queryTimeoutId;
            var result = this.props.onQuery(q, this.props.instance);
            Promise.resolve(result)
               .then((results) => {
                  this.setState({
                     options: results,
                     cursorKey: this.suggestCursorKey(results),
                     status: "loaded"
                  })
               })
               .catch(err => {
                  this.setState({status: "error"});
                  Console.log("Lookup query error:", err);
               })
         }, widget.queryDelay);
      }
   }

   componentWillReceiveProps(props) {
      if (props.instance.data.visited)
         this.setState({ visited: true });
      tooltipComponentWillReceiveProps(this.dom.input, props.instance, this.state);
   }

   componentDidMount() {
      tooltipComponentDidMount(this.dom.input, this.props.instance, this.state);
      if (this.props.instance.data.autoFocus)
         this.dom.input.focus();
   }

   componentWillUnmount() {
      if (this.queryTimeoutId)
         clearTimeout(this.queryTimeoutId);
      tooltipComponentWillUnmount(this.dom.input);
   }
}


