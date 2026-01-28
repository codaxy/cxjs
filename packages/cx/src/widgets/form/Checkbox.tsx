/** @jsxImportSource react */

import { VDOM } from "../../ui/VDOM";
import type { Instance } from "../../ui/Instance";
import type { RenderingContext } from "../../ui/RenderingContext";
import { Widget, getContent } from "../../ui/Widget";
import { stopPropagation } from "../../util/eventCallbacks";
import { KeyCode } from "../../util/KeyCode";
import CheckIcon from "../icons/check";
import SquareIcon from "../icons/square";
import { tooltipMouseLeave, tooltipMouseMove } from "../overlay/tooltip-ops";
import { Field, FieldConfig, getFieldTooltip, FieldInstance } from "./Field";
import { BooleanProp, Prop, StringProp } from "../../ui/Prop";

export interface CheckboxConfig extends FieldConfig {
  /** Value of the checkbox. */
  value?: Prop<boolean | null>;

  /** Set to `true` to make the checkbox read-only. */
  readOnly?: BooleanProp;

  /** Base CSS class to be applied to the element. Defaults to `checkbox`. */
  baseClass?: string;

  /** Use native checkbox HTML element. */
  native?: boolean;

  /** Set to `true` to display a square icon to indicate `null` or `undefined` value. */
  indeterminate?: boolean;

  /** Checked value alias for `value`. */
  checked?: Prop<boolean | null>;

  /** Text description. */
  text?: StringProp;

  /** Set to true to disable focusing on the checkbox. Used in grids to avoid conflicts. */
  unfocusable?: boolean;

  /** View mode text. */
  viewText?: StringProp;

  /** Custom validation function. */
  onValidate?:
    | string
    | ((
        value: boolean,
        instance: Instance,
        validationParams: Record<string, unknown>,
      ) => unknown);
}

export class Checkbox extends Field<CheckboxConfig> {
  declare public baseClass: string;
  declare public checked?: unknown;
  declare public value?: unknown;
  declare public indeterminate?: boolean;
  declare public unfocusable?: boolean;
  declare public native?: boolean;

  constructor(config?: CheckboxConfig) {
    super(config);
  }

  init(): void {
    if (this.checked) this.value = this.checked;

    super.init();
  }

  declareData(...args: Record<string, unknown>[]): void {
    super.declareData(
      {
        value: !this.indeterminate ? false : undefined,
        text: undefined,
        readOnly: undefined,
        disabled: undefined,
        enabled: undefined,
        required: undefined,
        viewText: undefined,
      },
      ...args,
    );
  }

  renderWrap(
    context: RenderingContext,
    instance: FieldInstance<Checkbox>,
    key: string,
    content: React.ReactNode,
  ): React.ReactElement {
    let { data } = instance;
    return (
      <label
        key={key}
        className={data.classNames}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (this.unfocusable) e.preventDefault();
        }}
        onMouseMove={(e) => {
          const tooltip = getFieldTooltip(instance);
          if (Array.isArray(tooltip)) {
            tooltipMouseMove(e, ...tooltip);
          }
        }}
        onMouseLeave={(e) => {
          const tooltip = getFieldTooltip(instance);
          if (Array.isArray(tooltip)) {
            tooltipMouseLeave(e, ...tooltip);
          }
        }}
        onClick={(e) => {
          this.handleClick(e, instance);
        }}
        style={data.style}
      >
        {content}
        {this.labelPlacement &&
          getContent(this.renderLabel(context, instance, "label"))}
      </label>
    );
  }

  validateRequired(
    context: RenderingContext,
    instance: FieldInstance<Checkbox>,
  ): string | undefined {
    let { data } = instance;
    if (!data.value) return this.requiredText;
  }

  renderNativeCheck(
    context: RenderingContext,
    instance: FieldInstance<Checkbox>,
  ): React.ReactElement {
    let { CSS, baseClass } = this;
    let { data } = instance;
    return (
      <input
        key="input"
        className={CSS.element(baseClass, "checkbox")}
        id={data.id}
        type="checkbox"
        checked={data.value || false}
        disabled={data.disabled}
        {...data.inputAttrs}
        onClick={stopPropagation}
        onChange={(e) => {
          this.handleChange(
            e,
            instance,
            (e.target as HTMLInputElement).checked,
          );
        }}
      />
    );
  }

  renderCheck(
    context: RenderingContext,
    instance: FieldInstance<Checkbox>,
  ): React.ReactElement {
    return <CheckboxCmp key="check" instance={instance} data={instance.data} />;
  }

  renderInput(
    context: RenderingContext,
    instance: FieldInstance<Checkbox>,
    key: string,
  ): React.ReactElement {
    let { data } = instance;
    let text = data.text || this.renderChildren?.(context, instance);
    let { CSS, baseClass } = this;
    return this.renderWrap(context, instance, key, [
      this.native
        ? this.renderNativeCheck(context, instance)
        : this.renderCheck(context, instance),
      text ? (
        <div key="text" className={CSS.element(baseClass, "text")}>
          {text}
        </div>
      ) : (
        <span key="baseline" className={CSS.element(baseClass, "baseline")}>
          &nbsp;
        </span>
      ),
    ]);
  }

  renderValue(
    context: RenderingContext,
    instance: FieldInstance,
  ): React.ReactNode {
    let { data } = instance;
    if (!data.viewText) return super.renderValue(context, instance, undefined);
    return (
      <span className={this.CSS.element(this.baseClass, "view-text")}>
        {data.viewText}
      </span>
    );
  }

  formatValue(
    context: RenderingContext,
    instance: Instance,
  ): React.ReactNode | string {
    let { data } = instance;
    return (
      data.value && (data.text || this.renderChildren?.(context, instance))
    );
  }

  handleClick(e: React.MouseEvent, instance: Instance): void {
    if (this.native) e.stopPropagation();
    else {
      var el = document.getElementById(instance.data.id);
      if (el) el.focus();
      if (!instance.data.viewMode) {
        e.preventDefault();
        e.stopPropagation();
        this.handleChange(e, instance, !instance.data.value);
      }
    }
  }

  handleChange(
    e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent,
    instance: Instance,
    checked?: boolean,
  ): void {
    let { data } = instance;

    if (data.readOnly || data.disabled || data.viewMode) return;

    instance.set(
      "value",
      checked != null ? checked : (e.target as HTMLInputElement).checked,
    );
  }
}

Checkbox.prototype.baseClass = "checkbox";
Checkbox.prototype.native = false;
Checkbox.prototype.indeterminate = false;
Checkbox.prototype.unfocusable = false;

Widget.alias("checkbox", Checkbox);

interface CheckboxCmpProps {
  key?: string;
  instance: FieldInstance<Checkbox>;
  data: Record<string, any>;
}

interface CheckboxCmpState {
  value: unknown;
}

class CheckboxCmp extends VDOM.Component<CheckboxCmpProps, CheckboxCmpState> {
  constructor(props: CheckboxCmpProps) {
    super(props);
    this.state = {
      value: props.data.value,
    };
  }

  UNSAFE_componentWillReceiveProps(props: CheckboxCmpProps) {
    this.setState({
      value: props.data.value,
    });
  }

  render(): React.ReactElement {
    let { instance, data } = this.props;
    let { widget } = instance;
    let { baseClass, CSS } = widget;

    let check: string | boolean = false;

    if (this.state.value == null && widget.indeterminate)
      check = "indeterminate";
    else if (this.state.value) check = "check";

    return (
      <span
        key="check"
        tabIndex={
          widget.unfocusable || data.disabled
            ? undefined
            : (data.tabIndex as number) || 0
        }
        className={CSS.element(baseClass, "input", {
          checked: check,
        })}
        style={CSS.parseStyle(data.inputStyle)}
        id={data.id}
        onClick={this.onClick.bind(this)}
        onKeyDown={this.onKeyDown.bind(this)}
      >
        {check == "check" && (
          <CheckIcon className={CSS.element(baseClass, "input-check")} />
        )}
        {check == "indeterminate" && (
          <SquareIcon className={CSS.element(baseClass, "input-check")} />
        )}
      </span>
    );
  }

  onClick(e: React.MouseEvent): void {
    let { instance, data } = this.props;
    let { widget } = instance;
    if (!data.disabled && !data.readOnly) {
      e.stopPropagation();
      e.preventDefault();
      this.setState({ value: !this.state.value });
      widget.handleChange(e, instance, !this.state.value);
    }
  }

  onKeyDown(e: React.KeyboardEvent): void {
    let { instance } = this.props;
    const { widget } = instance;
    if (
      widget.handleKeyDown &&
      widget.handleKeyDown(
        e as unknown as React.KeyboardEvent<Element>,
        instance,
      ) === false
    )
      return;

    switch (e.keyCode) {
      case KeyCode.space:
        this.onClick(e as unknown as React.MouseEvent);
        break;
    }
  }
}
