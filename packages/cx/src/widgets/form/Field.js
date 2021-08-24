import { VDOM, getContent } from "../../ui/Widget";
import { PureContainer } from "../../ui/PureContainer";
import { ValidationError } from "./ValidationError";
import { HelpText } from "./HelpText";
import { Label } from "./Label";
import { stopPropagation } from "../../util/eventCallbacks";
import { isSelector } from "../../data/isSelector";
import { Localization } from "../../ui/Localization";
import { isPromise } from "../../util/isPromise";
import { Console } from "../../util/Console";
import { parseStyle } from "../../util/parseStyle";
import { FocusManager } from "../../ui/FocusManager";
import { isTouchEvent } from "../../util/isTouchEvent";
import { tooltipMouseLeave, tooltipMouseMove } from "../overlay/tooltip-ops";
import { coalesce } from "../../util/coalesce";
import { isUndefined } from "../../util/isUndefined";
import { shallowEquals } from "../../util/shallowEquals";

export class Field extends PureContainer {
   declareData() {
      super.declareData(
         {
            label: undefined,
            labelWidth: undefined,
            mode: undefined,
            viewMode: undefined,
            id: undefined,
            error: undefined,
            inputStyle: { structured: true },
            inputClass: { structured: true },
            inputAttrs: { structured: true },
            emptyText: undefined,
            visited: undefined,
            autoFocus: undefined,
            tabOnEnterKey: undefined,
            tabIndex: undefined,
            validationParams: { structured: true },
         },
         ...arguments
      );
   }

   init() {
      if (this.validationMode == 'tooltip' && isUndefined(this.errorTooltip)) {
         this.errorTooltip = {
            text: { bind: "$error" },
            mod: "error",
            ...this.errorTooltip,
         };
      }

      if (isUndefined(this.help)) {
         switch (this.validationMode) {
            case "help":
            case "help-inline":
               this.help = ValidationError;
               break;

            case "help-block":
               this.help = {
                  type: ValidationError,
                  mod: "block",
               };
               break;
         }
      }

      if (this.help != null) {
         let helpConfig = {};

         if (this.help.isComponentType) helpConfig = this.help;
         else if (isSelector(this.help)) helpConfig.text = this.help;
         else Object.assign(helpConfig, this.help);

         this.help = HelpText.create(helpConfig);
      }

      if (this.label != null) {
         let labelConfig = {
            mod: this.mod,
            disabled: this.disabled,
            required: this.required,
            asterisk: this.asterisk,
            style: this.labelStyle,
            class: this.labelClass,
         };

         if (this.label.isComponentType) labelConfig = this.label;
         else if (isSelector(this.label)) labelConfig.text = this.label;
         else Object.assign(labelConfig, this.label);

         this.label = Label.create(labelConfig);
      }

      this.inputStyle = parseStyle(this.inputStyle);

      super.init();
   }

   initComponents(context, instance) {
      return super.initComponents(...arguments, {
         label: this.label,
         help: this.help,
      });
   }

   initState(context, instance) {
      instance.state = {
         inputError: false,
         visited: this.visited === true,
      };
   }

   prepareData(context, instance) {
      let { data, state } = instance;
      if (!data.id) data.id = "fld-" + instance.id;

      data._disabled = data.disabled;
      data._readOnly = data.readOnly;
      data._viewMode = data.mode === "view" || data.viewMode;
      data._tabOnEnterKey = data.tabOnEnterKey;
      instance.parentDisabled = context.parentDisabled;
      instance.parentReadOnly = context.parentReadOnly;
      instance.parentViewMode = context.parentViewMode;
      instance.parentTabOnEnterKey = context.parentTabOnEnterKey;
      instance.parentVisited = context.parentVisited;

      if (typeof data.enabled !== "undefined") data._disabled = !data.enabled;

      this.disableOrValidate(context, instance);

      data.inputStyle = parseStyle(data.inputStyle);

      if (this.labelPlacement && this.label) data.mod = [data.mod, "label-placement-" + this.labelPlacement];

      if (this.helpPlacement && this.help) data.mod = [data.mod, "help-placement-" + this.helpPlacement];

      data.empty = this.isEmpty(data);

      super.prepareData(...arguments);
   }

   disableOrValidate(context, instance) {
      let { data, state } = instance;

      //if the parent is strict and sets some flag to true, it is not allowed to overrule that flag by field settings

      data.disabled = coalesce(
         context.parentStrict ? context.parentDisabled : null,
         data._disabled,
         context.parentDisabled
      );
      data.readOnly = coalesce(
         context.parentStrict ? context.parentReadOnly : null,
         data._readOnly,
         context.parentReadOnly
      );
      data.viewMode = coalesce(
         context.parentStrict ? context.parentViewMode : null,
         data._viewMode,
         context.parentViewMode
      );
      data.tabOnEnterKey = coalesce(
         context.parentStrict ? context.parentTabOnEnterKey : null,
         data._tabOnEnterKey,
         context.parentTabOnEnterKey
      );
      data.visited = coalesce(context.parentStrict ? context.parentVisited : null, data.visited, context.parentVisited);

      if (!data.error && !data.disabled && !data.viewMode) this.validate(context, instance);

      if (data.visited && !state.visited) {
         //feels hacky but it should be ok since we're in the middle of a new render cycle
         state.visited = true;
      }

      data.stateMods = {
         ...data.stateMods,
         disabled: data.disabled,
         "edit-mode": !data.viewMode,
         "view-mode": data.viewMode,
      };
   }

   explore(context, instance) {
      let { data, state } = instance;

      instance.parentDisabled = context.parentDisabled;
      instance.parentReadOnly = context.parentReadOnly;
      instance.parentViewMode = context.parentViewMode;
      instance.parentTabOnEnterKey = context.parentTabOnEnterKey;
      instance.parentVisited = context.parentVisited;

      if (
         instance.cache("parentDisabled", context.parentDisabled) ||
         instance.cache("parentReadOnly", context.parentReadOnly) ||
         instance.cache("parentViewMode", context.parentViewMode) ||
         instance.cache("parentTabOnEnterKey", context.parentTabOnEnterKey) ||
         instance.cache("parentVisited", context.parentVisited)
      ) {
         instance.markShouldUpdate(context);
         this.disableOrValidate(context, instance);
         this.prepareCSS(context, instance);
      }

      if (!context.validation)
         context.validation = {
            errors: [],
         };

      if (data.error) {
         context.validation.errors.push({
            fieldId: data.id,
            message: data.error,
            visited: state.visited,
            type: "error",
         });
      }

      context.push("lastFieldId", data.id);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop("lastFieldId");
   }

   isEmpty(data) {
      return data.value == null || data.value === this.emptyValue;
   }

   validateRequired(context, instance) {
      let { data } = instance;
      if (this.isEmpty(data)) return this.requiredText;
   }

   validate(context, instance) {
      let { data, state } = instance;
      state = state || {};

      let empty = this.isEmpty(data);

      if (!data.error) {
         if (state.inputError) data.error = state.inputError;
         else if (state.validating && !empty) data.error = this.validatingText;
         else if (state.validationError && data.value === state.lastValidatedValue && shallowEquals(data.validationParams, state.lastValidationParams))
            data.error = state.validationError;
         else if (data.required) data.error = this.validateRequired(context, instance);
      }

      if (
         !empty &&
         !state.validating &&
         !data.error &&
         this.onValidate &&
         (!state.previouslyValidated || data.value != state.lastValidatedValue || data.validationParams != state.lastValidationParams)
      ) {
         let result = instance.invoke("onValidate", data.value, instance, data.validationParams);
         if (isPromise(result)) {
            data.error = this.validatingText;
            instance.setState({
               validating: true,
               lastValidatedValue: data.value,
               previouslyValidated: true,
               lastValidationParams: data.validationParams
            });
            result
               .then((r) => {
                  let { data, state } = instance;
                  let error = data.value == state.lastValidatedValue && shallowEquals(data.validationParams, state.lastValidationParams)
                     ? r
                     : this.validatingText; //parameters changed, this will be revalidated

                  instance.setState({
                     validating: false,
                     validationError: error,
                  });
               })
               .catch((e) => {
                  instance.setState({
                     validating: false,
                     validationError: this.validationExceptionText,
                  });
                  if (this.onValidationException) instance.invoke("onValidationException", e, instance);
                  else {
                     Console.warn("Unhandled validation exception:", e);
                  }
               });
         } else {
            data.error = result;
         }
      }
   }

   renderLabel(context, instance, key) {
      if (instance.components.label) return getContent(instance.components.label.vdom);
   }

   renderInput(context, instance, key) {
      throw new Error("Not implemented.");
   }

   renderHelp(context, instance, key) {
      if (instance.components.help) return getContent(instance.components.help.render(context, key));
   }

   formatValue(context, { data }) {
      return data.text || data.value;
   }

   renderValue(context, instance, key) {
      let text = this.formatValue(context, instance);
      if (text) {
         return (
            <span
               key={key}
               onMouseMove={(e) => tooltipMouseMove(e, ...getFieldTooltip(instance))}
               onMouseLeave={(e) => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
            >
               {text}
            </span>
         );
      }
   }

   renderContent(context, instance, key) {
      let content = this.renderValue(...arguments) || this.renderEmptyText(...arguments);
      return this.renderWrap(context, instance, key, content);
   }

   renderWrap(context, instance, key, content) {
      let { data } = instance;
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

   renderEmptyText(context, { data }, key) {
      return (
         <span key={key} className={this.CSS.element(this.baseClass, "empty-text")}>
            {data.emptyText || <span>&nbsp;</span>}
         </span>
      );
   }

   render(context, instance, key) {
      let { data } = instance;
      let content = !data.viewMode
         ? this.renderInput(context, instance, key)
         : this.renderContent(context, instance, key);

      return {
         label: !this.labelPlacement && this.renderLabel(context, instance, key),
         content: content,
         helpSpacer: this.helpSpacer && instance.components.help ? " " : null,
         help: !this.helpPlacement && this.renderHelp(context, instance, key),
      };
   }

   handleKeyDown(e, instance) {
      if (this.onKeyDown && instance.invoke("onKeyDown", e, instance) === false) return false;

      if (instance.data.tabOnEnterKey && e.keyCode === 13) {
         let target = e.target;
         setTimeout(() => {
            if (!instance.state.inputError) FocusManager.focusNext(target);
         }, 10);
      }
   }
}

Field.prototype.validationMode = "tooltip";
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
Field.prototype.emptyValue = null;
Field.prototype.styled = true;

//These flags are inheritable and should not be set to false
//Field.prototype.visited = null;
//Field.prototype.disabled = null;
//Field.prototype.readOnly = null;
//Field.prototype.viewMode = null;

Localization.registerPrototype("cx/widgets/Field", Field);

export function getFieldTooltip(instance) {
   let { widget, data, state } = instance;

   if (widget.errorTooltip && data.error && (!state || state.visited || !widget.suppressErrorsUntilVisited))
      return [
         instance,
         widget.errorTooltip,
         {
            data: {
               $error: data.error,
            },
         },
      ];
   return [instance, widget.tooltip];
}

export function autoFocus(el, component) {
   if (isTouchEvent()) return;
   let data = component.props.data || component.props.instance.data;
   let autoFocusValue = el && data.autoFocus;
   if (autoFocusValue && autoFocusValue != component.autoFocusValue)
      FocusManager.focus(el);
   component.autoFocusValue = autoFocusValue;
}
