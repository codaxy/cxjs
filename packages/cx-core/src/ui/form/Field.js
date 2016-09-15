import {Widget, VDOM} from '../Widget';
import {PureContainer} from '../PureContainer';
import {Label} from './Label';
import {stopPropagation} from '../eventCallbacks';
import {Localization} from '../Localization';

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
         style: {structured: true},
         tooltip: {structured: true},
         emptyText: undefined,
         errorTooltip: {structured: true},
         visited: undefined,
         autoFocus: undefined
      }, ...arguments);
   }

   init() {
      super.init();

      if (this.help != null) {
         this.help = Widget.create(PureContainer, {items: this.help});
      }
   }

   initInstance(context, instance) {
      super.initInstance(context, instance);
      if (this.help)
         instance.help = instance.getChild(context, this.help, "help");
   }

   initState(context, instance) {
      instance.state = {
         inputError: false
      };
   }

   prepareData(context, instance) {
      var {data} = instance;
      if (!data.id)
         data.id = 'fld-' + instance.id;

      if (typeof data.enabled != 'undefined')
         data.disabled = !data.enabled;

      if (!data.error && !data.disabled)
         this.validate(context, instance);

      data.stateMods = {...data.stateMods,
         error: data.error,
         disabled: data.disabled
      };
      data.stateMods[(data.mode || 'edit')+'-mode'] = true;

      data.inputStyle = this.CSS.parseStyle(data.inputStyle);

      super.prepareData(...arguments);
   }

   explore(context, instance) {
      var {data} = instance;

      if (data.error && context.validation) {
         context.validation.errors.push({
            fieldId: data.id,
            message: data.error,
            type: 'error'
         });
      }

      context.lastFieldId = data.id;

      super.explore(context, instance);

      if (instance.help)
         instance.help.explore(context);

      delete context.lastFieldId;
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      if (instance.help)
         instance.help.prepare(context);
   }

   cleanup(context, instance) {
      if (instance.help)
         instance.help.cleanup(context);

      super.cleanup(context, instance);
   }

   validateRequired(context, instance) {
      var {data} = instance;
      if (!data.value)
         return this.requiredText;
   }

   validate(context, instance) {
      var {data, state} = instance;

      if (!data.error) {
         if (state.inputError)
            data.error = state.inputError;
         else if (data.required)
            data.error = this.validateRequired(context, instance);
      }

      if (!data.error && this.onValidate)
         data.error = this.onValidate(data.value);
   }

   renderLabel(key, data) {
      var options = {
         style: {
            width: data.labelWidth
         }
      };
      return Label(key, data.label, data.id, options)
   }

   renderInput(context, instance, key) {
      throw new Error('Not implemented.')
   }

   renderHelp(context, instance, key) {
      if (instance.help)
         return instance.help.render(context, key);
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
         label: this.renderLabel(key + '-label', data),
         content: content,
         help: this.renderHelp(context, instance, key + 'help')
      }
   }
}

Field.prototype.errorTooltipsEnabled = true;
Field.prototype.visited = false;
Field.prototype.suppressErrorTooltipsUntilVisited = false;
Field.prototype.requiredText = "This field is required.";
Field.prototype.autoFocus = false;

//Field.prototype.pure = false; //validation through context - recheck

Localization.registerPrototype('Cx.ui.form.Field', Field);
