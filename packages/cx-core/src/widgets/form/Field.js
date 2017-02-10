import {Widget, VDOM} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';
import {ValidationError} from './ValidationError';
import {Label} from './Label';
import {stopPropagation} from '../../util/eventCallbacks';
import {isSelector} from '../../data/isSelector';
import {Localization} from '../../ui/Localization';
import {isPromise} from '../../util/isPromise';
import {Console} from '../../util/Console';
import {parseStyle} from '../../util/parseStyle';

export class Field extends PureContainer {

   declareData() {
      super.declareData({
         label: undefined,
         labelWidth: undefined,
         mode: undefined,
         id: undefined,
         error: undefined,
         class: {structured: true},
         className: {structured: true},
         inputStyle: {structured: true},
         inputAttrs: {structured: true},
         style: {structured: true},
         tooltip: {structured: true},
         emptyText: undefined,
         errorTooltip: {structured: true},
         visited: undefined,
         autoFocus: undefined
      }, ...arguments);
   }

   init() {

      switch (this.validationMode) {
         case 'tooltip':
            this.errorTooltip = true;
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
         this.help = Widget.create(PureContainer, {items: this.help});
      }

      if (this.label != null) {
         let labelConfig = {
            type: Label,
            required: this.required,
            asterisk: this.asterisk
         };

         if (this.label.isComponentType)
            labelConfig = this.label;
         else if (isSelector(this.label))
            labelConfig.text = this.label;
         else
            Object.assign(labelConfig, this.label);

         this.label = Widget.create(labelConfig);
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
         inputError: false
      };
   }

   prepareData(context, instance) {
      let {data} = instance;
      if (!data.id)
         data.id = 'fld-' + instance.id;

      data._disabled = data.disabled;
      instance.parentDisabled = context.parentDisabled || false;

      if (typeof data.enabled != 'undefined')
         data._disabled = !data.enabled;

      this.disableOrValidate(context, instance);

      data.inputStyle = parseStyle(data.inputStyle);

      super.prepareData(...arguments);
   }

   disableOrValidate(context, instance) {
      let {data} = instance;
      data.disabled = data._disabled || instance.parentDisabled;
      if (!data.error && !data.disabled)
         this.validate(context, instance);

      data.stateMods = {
         ...data.stateMods,
         error: data.error,
         disabled: data.disabled,
         [(data.mode || 'edit') + '-mode']: true
      };
   }

   explore(context, instance) {
      let {data} = instance;

      if (context.parentDisabled !== instance.parentDisabled) {
         instance.parentDisabled = context.parentDisabled;
         instance.shouldUpdate = true;
         this.disableOrValidate(context, instance);
      }

      if (data.error && context.validation) {
         context.validation.errors.push({
            fieldId: data.id,
            message: data.error,
            type: 'error'
         });
      }

      context.lastFieldId = data.id;

      super.explore(context, instance);

      delete context.lastFieldId;
   }

   validateRequired(context, instance) {
      var {data} = instance;
      if (data.value == null)
         return this.requiredText;
   }

   validate(context, instance) {
      var {data, state} = instance;
      state = state || {};

      if (!data.error) {
         if (state.validating)
            data.error = this.validatingText;
         else if (data.required)
            data.error = this.validateRequired(context, instance);
      }

      if (!data.error && data.value != null && this.onValidate && !state.validating && data.value != state.lastValidatedValue) {
         let result = this.onValidate(data.value, instance);
         if (isPromise(result)) {
            data.error = this.validatingText;
            instance.setState({
               validating: true,
               lastValidatedValue: data.value
            });
            result
               .then(r=> {
                  instance.setState({
                     validating: false,
                     inputError: r
                  })
               })
               .catch(e=> {
                  instance.setState({
                     validating: false,
                     inputError: this.validationExceptionText
                  });
                  if (this.onValidationException)
                     this.onValidationException(e, instance);
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
         return instance.components.label.render(context, key);
   }

   renderInput(context, instance, key) {
      throw new Error('Not implemented.')
   }

   renderHelp(context, instance, key) {
      if (instance.components.help)
         return instance.components.help.render(context, key);
   }

   formatValue(context, {data}) {
      return data.text || data.value;
   }

   renderValue(context, instance, key) {
      var text = this.formatValue(context, instance)
      if (text) {
         return <span>{text}</span>;
      }
   }

   renderContent(context, instance, key) {
      var content = this.renderValue(...arguments) || this.renderEmptyText(...arguments);
      return this.renderWrap(context, instance, key, content);
   }

   renderWrap(context, instance, key, content) {
      var {data} = instance;
      return <div key={key} className={data.classNames} style={data.style} onMouseDown={stopPropagation} onTouchStart={stopPropagation}>
         {content}
      </div>;
   }

   renderEmptyText(context, {data}, key) {
      return <span key={key} className={this.CSS.element(this.baseClass, 'empty-text')}>{data.emptyText || <span>&nbsp;</span>}</span>;
   }

   render(context, instance, key) {
      var {data} = instance;
      var content = data.mode != 'view'
         ? this.renderInput(context, instance, key + 'input')
         : this.renderContent(context, instance, key + 'content');

      return {
         label: this.renderLabel(context, instance, key),
         content: content,
         helpSpacer: this.helpSpacer && instance.components.help ? ' ' : null,
         help: this.renderHelp(context, instance, key)
      }
   }
}

Field.prototype.validationMode = "tooltip";
Field.prototype.visited = false;
Field.prototype.suppressErrorTooltipsUntilVisited = false;
Field.prototype.requiredText = "This field is required.";
Field.prototype.autoFocus = false;
Field.prototype.asterisk = false;
Field.prototype.validatingText = "Validation is in progress...";
Field.prototype.validationExceptionText = "Something went wrong during input validation. Check log for more details.";
Field.prototype.helpSpacer = true;

//Field.prototype.pure = false; //validation through context - recheck

Localization.registerPrototype('cx/widgets/Field', Field);
