import {Widget, VDOM, getContent} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';
import {ValidationError} from './ValidationError';
import {HelpText} from './HelpText';
import {Label} from './Label';
import {stopPropagation} from '../../util/eventCallbacks';
import {isSelector} from '../../data/isSelector';
import {Localization} from '../../ui/Localization';
import {isPromise} from '../../util/isPromise';
import {Console} from '../../util/Console';
import {parseStyle} from '../../util/parseStyle';
import {FocusManager} from '../../ui/FocusManager';
import {isTouchEvent} from '../../util/isTouchEvent';
import {tooltipMouseLeave, tooltipMouseMove} from "../overlay/tooltip-ops";

export class Field extends PureContainer {

   declareData() {
      super.declareData({
         label: undefined,
         labelWidth: undefined,
         mode: undefined,
         viewMode: undefined,
         id: undefined,
         error: undefined,
         inputStyle: {structured: true},
         inputAttrs: {structured: true},
         emptyText: undefined,
         visited: undefined,
         autoFocus: undefined,
         tabOnEnterKey: undefined
      }, ...arguments);
   }

   init() {

      switch (this.validationMode) {
         case 'tooltip':
            this.errorTooltip = {
               text: {bind: '$error'},
               mod: 'error',
               ...this.errorTooltip
            };
            break;

         case 'help':
         case 'help-inline':
            this.help = ValidationError;
            break;

         case 'help-block':
            this.help = {
               type: ValidationError,
               mod: 'block'
            };
            break;
      }

      if (this.help != null) {
         let helpConfig = {};

         if (this.help.isComponentType)
            helpConfig = this.help;
         else if (isSelector(this.help))
            helpConfig.text = this.help;
         else
            Object.assign(helpConfig, this.help);

         this.help = HelpText.create(helpConfig);
      }

      if (this.label != null) {
         let labelConfig = {
            mod: this.mod,
            disabled: this.disabled,
            required: this.required,
            asterisk: this.asterisk
         };

         if (this.label.isComponentType)
            labelConfig = this.label;
         else if (isSelector(this.label))
            labelConfig.text = this.label;
         else
            Object.assign(labelConfig, this.label);

         this.label = Label.create(labelConfig);
      }

      this.inputStyle = parseStyle(this.inputStyle);

      super.init();
   }

   initComponents(context, instance) {
      return super.initComponents(...arguments, {
         label: this.label,
         help: this.help
      });
   }

   initState(context, instance) {
      instance.state = {
         inputError: false,
         visited: this.visited === true
      };
   }

   prepareData(context, instance) {
      let {data, state} = instance;
      if (!data.id)
         data.id = 'fld-' + instance.id;

      data._disabled = data.disabled;
      data._readOnly = data.readOnly;
      data._viewMode = data.viewMode || data.mode === 'view';
      data._tabOnEnterKey = data.tabOnEnterKey;
      instance.parentDisabled = context.parentDisabled;
      instance.parentReadOnly = context.parentReadOnly;
      instance.parentViewMode = context.parentViewMode;
      instance.parentTabOnEnterKey = context.parentTabOnEnterKey;

      if (typeof data.enabled !== 'undefined')
         data._disabled = !data.enabled;

      this.disableOrValidate(context, instance);

      data.inputStyle = parseStyle(data.inputStyle);

      if (this.labelPlacement && this.label)
         data.mod = [data.mod, 'label-placement-' + this.labelPlacement];

      if (this.helpPlacement && this.help)
         data.mod = [data.mod, 'help-placement-' + this.helpPlacement];

      data.empty = this.isEmpty(data);

      if (data.visited && !state.visited) {
         //feels hacky but it should be ok since we're in the middle of a new render cycle
         state.visited = true;
      }

      super.prepareData(...arguments);
   }

   disableOrValidate(context, instance) {
      let {data} = instance;
      data.disabled = data._disabled || context.parentDisabled;
      data.readOnly = data._readOnly || context.parentReadOnly;
      data.viewMode = data._viewMode || context.parentViewMode;
      data.tabOnEnterKey = data._tabOnEnterKey || context.parentTabOnEnterKey;

      if (!data.error && !data.disabled && !data.viewMode)
         this.validate(context, instance);

      data.stateMods = {
         ...data.stateMods,
         disabled: data.disabled,
         "edit-mode": !data.viewMode,
         "view-mode": data.viewMode
      };
   }

   explore(context, instance) {
      let {data, state} = instance;

      instance.parentDisabled = context.parentDisabled;
      instance.parentReadOnly = context.parentReadOnly;
      instance.parentViewMode = context.parentViewMode;
      instance.parentTabOnEnterKey = context.parentTabOnEnterKey;

      if (instance.cache('parentDisabled', context.parentDisabled) || instance.cache('parentReadOnly', context.parentReadOnly)
         || instance.cache('parentViewMode', context.parentViewMode) || instance.cache('parentTabOnEnterKey', context.parentTabOnEnterKey)) {

         instance.markShouldUpdate(context);
         this.disableOrValidate(context, instance);
         this.prepareCSS(context, instance);
      }

      if (!context.validation)
         context.validation = {
            errors: []
         };

      if (data.error) {
         context.validation.errors.push({
            fieldId: data.id,
            message: data.error,
            visited: state.visited,
            type: 'error'
         });
      }

      context.push('lastFieldId', data.id);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('lastFieldId');
   }

   isEmpty(data) {
      return data.value == null;
   }

   validateRequired(context, instance) {
      let {data} = instance;
      if (this.isEmpty(data))
         return this.requiredText;
   }

   validate(context, instance) {
      let {data, state} = instance;
      state = state || {};

      if (!data.error) {
         if (state.validating)
            data.error = this.validatingText;
         else if (data.required) {
            let required = this.validateRequired(context, instance);
            if (required)
               data.error = state.inputError || required;
         }
      }

      if (!data.error && !this.isEmpty(data) && this.onValidate && !state.validating && (!state.previouslyValidated || data.value != state.lastValidatedValue)) {
         let result = instance.invoke("onValidate", data.value, instance);
         if (isPromise(result)) {
            data.error = this.validatingText;
            instance.setState({
               validating: true,
               lastValidatedValue: data.value,
               previouslyValidated: true
            });
            result
               .then(r => {
                  instance.setState({
                     validating: false,
                     inputError: r
                  })
               })
               .catch(e => {
                  instance.setState({
                     validating: false,
                     inputError: this.validationExceptionText
                  });
                  if (this.onValidationException)
                     instance.invoke("onValidationException", e, instance);
                  else {
                     Console.warn('Unhandled validation exception:', e);
                  }
               });
         } else {
            data.error = result;
         }
      }

      if (!data.error && state.inputError)
         data.error = state.inputError;
   }

   renderLabel(context, instance, key) {
      if (instance.components.label)
         return getContent(instance.components.label.vdom);
   }

   renderInput(context, instance, key) {
      throw new Error('Not implemented.')
   }

   renderHelp(context, instance, key) {
      if (instance.components.help)
         return getContent(instance.components.help.render(context, key));
   }

   formatValue(context, {data}) {
      return data.text || data.value;
   }

   renderValue(context, instance, key) {
      let text = this.formatValue(context, instance)
      if (text) {
         return <span
            key={key}
            onMouseMove={e => tooltipMouseMove(e, ...getFieldTooltip(instance))}
            onMouseLeave={e => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
         >
            {text}
         </span>;
      }
   }

   renderContent(context, instance, key) {
      let content = this.renderValue(...arguments) || this.renderEmptyText(...arguments);
      return this.renderWrap(context, instance, key, content);
   }

   renderWrap(context, instance, key, content) {
      let {data} = instance;
      let interactive = !data.viewMode && !data.disabled;
      return (
         <div
            key={key}
            className={data.classNames}
            style={data.style}
            onMouseDown={interactive ? stopPropagation : null}
            onTouchStart={interactive ? stopPropagation : null}
         >
            {content}
            {this.labelPlacement && this.renderLabel(context, instance, "label")}
         </div>
      );
   }

   renderEmptyText(context, {data}, key) {
      return (
         <span key={key} className={this.CSS.element(this.baseClass, 'empty-text')}>
            {data.emptyText || <span>&nbsp;</span>}
         </span>
      );
   }

   render(context, instance, key) {
      let {data} = instance;
      let content = !data.viewMode
         ? this.renderInput(context, instance, key)
         : this.renderContent(context, instance, key);

      return {
         label: !this.labelPlacement && this.renderLabel(context, instance, key),
         content: content,
         helpSpacer: this.helpSpacer && instance.components.help ? ' ' : null,
         help: !this.helpPlacement && this.renderHelp(context, instance, key)
      }
   }

   handleKeyDown(e, instance) {
      if (this.onKeyDown && instance.invoke("onKeyDown", e, instance) === false)
         return false;

      if (instance.data.tabOnEnterKey && e.keyCode === 13) {
         let target = e.target;
         setTimeout(() => {
            if (!instance.state.inputError)
               FocusManager.focusNext(target);
         }, 10);
      }
   }
}

Field.prototype.validationMode = "tooltip";
Field.prototype.visited = false;
Field.prototype.suppressErrorsUntilVisited = false;
Field.prototype.requiredText = "This field is required.";
Field.prototype.autoFocus = false;
Field.prototype.asterisk = false;
Field.prototype.validatingText = "Validation is in progress...";
Field.prototype.validationExceptionText = "Something went wrong during input validation. Check log for more details.";
Field.prototype.helpSpacer = true;
Field.prototype.trackFocus = false; //add cxs-focus on parent element
Field.prototype.labelPlacement = false;
Field.prototype.helpPlacement = false;
Field.prototype.styled = true;

Localization.registerPrototype('cx/widgets/Field', Field);

export function getFieldTooltip(instance) {
   let {widget, data, state} = instance;

   if (widget.errorTooltip && data.error && (!state || state.visited || !widget.suppressErrorsUntilVisited))
      return [
         instance,
         widget.errorTooltip,
         {
            data: {
               $error: data.error
            }
         }
      ];
   return [instance, widget.tooltip];
}

export function autoFocus(el, component) {
   let data = component.props.data || component.props.instance.data;
   if (el && el !== component.autoFocusEl && data.autoFocus && !isTouchEvent())
      FocusManager.focus(el);

   component.autoFocusEl = el;
}