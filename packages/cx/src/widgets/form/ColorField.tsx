/** @jsxImportSource react */

import { Cx } from "../../ui/Cx";
import {
  DropdownInstance,
  DropdownWidgetProps,
  Instance,
} from "../../ui/Instance";
import type { RenderingContext } from "../../ui/RenderingContext";
import { VDOM, Widget, getContent } from "../../ui/Widget";
import { parseColor } from "../../util/color/parseColor";
import { isTouchDevice } from "../../util/isTouchDevice";
import { isTouchEvent } from "../../util/isTouchEvent";
import { Dropdown, DropdownConfig } from "../overlay/Dropdown";
import { ColorPicker } from "./ColorPicker";
import { Field, FieldConfig, getFieldTooltip, FieldInstance } from "./Field";
import { BooleanProp, StringProp } from "../../ui/Prop";
import { Config } from "../../ui/Prop";

export interface ColorFieldConfig extends FieldConfig {
  /** Either `rgba`, `hsla` or `hex` value of the selected color. */
  value?: StringProp;

  /** Defaults to `false`. Used to make the field read-only. */
  readOnly?: BooleanProp;

  /** The opposite of `disabled`. */
  enabled?: BooleanProp;

  /** Default text displayed when the field is empty. */
  placeholder?: StringProp;

  /** Set to `true` to hide the clear button. Default value is `false`. */
  hideClear?: boolean;

  /** Set to `false` to hide the clear button. Default value is `true`. */
  showClear?: boolean;

  /** Set to `true` to display the clear button even if `required` is set. Default is `false`. */
  alwaysShowClear?: boolean;

  /** Base CSS class to be applied to the element. Defaults to `colorfield`. */
  baseClass?: string;

  /** Format of the color representation. Either `rgba`, `hsla` or `hex`. */
  format?: "rgba" | "hsla" | "hex";

  /** Additional configuration to be passed to the dropdown, such as `style`, `positioning`, etc. */
  dropdownOptions?: Partial<DropdownConfig>;

  /** Custom validation function. */
  onValidate?:
    | string
    | ((
        value: string,
        instance: Instance,
        validationParams: Record<string, unknown>,
      ) => unknown);
}

export class ColorFieldInstance<F extends ColorField = ColorField>
  extends FieldInstance<F>
  implements DropdownWidgetProps
{
  lastDropdown?: Instance;
  dropdownOpen?: boolean;
  selectedIndex?: number;
}

import { stopPropagation } from "../../util/eventCallbacks";
import { KeyCode } from "../../util/KeyCode";
import {
  tooltipMouseLeave,
  tooltipMouseMove,
  tooltipParentDidMount,
  tooltipParentWillReceiveProps,
  tooltipParentWillUnmount,
} from "../overlay/tooltip-ops";

import { Localization } from "../../ui/Localization";
import { getActiveElement } from "../../util/getActiveElement";
import { isDefined } from "../../util/isDefined";
import ClearIcon from "../icons/clear";
import DropdownIcon from "../icons/drop-down";

interface ColorInputProps {
  key?: string;
  instance: ColorFieldInstance;
  data: Record<string, unknown>;
  picker: {
    value: unknown;
    format: string;
  };
  label?: React.ReactNode;
  help?: React.ReactNode;
}

interface ColorInputState {
  dropdownOpen: boolean;
  focus: boolean;
}

export class ColorField extends Field<ColorFieldConfig> {
  declare public baseClass: string;
  declare public showClear?: boolean;
  declare public alwaysShowClear?: boolean;
  declare public hideClear?: boolean;
  declare public format: string;
  declare public lastDropdown?: string;
  declare public value?: string;
  declare public dropdownOptions?: Partial<DropdownConfig>;

  constructor(config?: ColorFieldConfig) {
    super(config);
  }

  declareData(...args: Record<string, unknown>[]): void {
    super.declareData(
      {
        value: this.emptyValue,
        disabled: undefined,
        readOnly: undefined,
        enabled: undefined,
        placeholder: undefined,
        required: undefined,
        format: undefined,
      },
      ...args,
    );
  }

  init(): void {
    if (isDefined(this.hideClear)) this.showClear = !this.hideClear;

    if (this.alwaysShowClear) this.showClear = true;

    super.init();
  }

  prepareData(context: RenderingContext, instance: ColorFieldInstance): void {
    let { data } = instance;
    data.stateMods = [
      data.stateMods,
      {
        empty: !data.value,
      },
    ];
    instance.lastDropdown = context.lastDropdown;
    super.prepareData(context, instance);
  }

  renderInput(
    context: RenderingContext,
    instance: ColorFieldInstance,
    key: string,
  ): React.ReactNode {
    return (
      <ColorInput
        key={key}
        instance={instance}
        data={instance.data}
        picker={{
          value: this.value,
          format: this.format,
        }}
        label={
          this.labelPlacement &&
          getContent(this.renderLabel(context, instance, "label"))
        }
        help={
          this.helpPlacement &&
          getContent(this.renderHelp(context, instance, "help"))
        }
      />
    );
  }
}

ColorField.prototype.baseClass = "colorfield";
ColorField.prototype.format = "rgba";
ColorField.prototype.suppressErrorsUntilVisited = true;
ColorField.prototype.showClear = true;
ColorField.prototype.alwaysShowClear = false;

Widget.alias("color-field", ColorField);
Localization.registerPrototype("cx/widgets/ColorField", ColorField);

class ColorInput extends VDOM.Component<ColorInputProps, ColorInputState> {
  data: Record<string, unknown>;
  dropdown?: Widget;
  input!: HTMLInputElement;
  openDropdownOnFocus: boolean = false;
  scrollableParents?: Element[];
  updateDropdownPosition: () => void;

  constructor(props: ColorInputProps) {
    super(props);
    let { data } = this.props;
    this.data = data;
    this.state = {
      dropdownOpen: false,
      focus: false,
    };
    this.updateDropdownPosition = () => {};
  }

  getDropdown(): Widget {
    if (this.dropdown) return this.dropdown;

    let { widget, lastDropdown } = this.props.instance as DropdownInstance;
    const colorFieldWidget = widget as ColorField;

    let dropdown = {
      scrollTracking: true,
      autoFocus: true, //put focus on the dropdown to prevent opening the keyboard
      focusable: true,
      inline: !isTouchDevice() || !!lastDropdown,
      touchFriendly: true,
      placementOrder:
        " down down-left down-right up up-left up-right right right-up right-down left left-up left-down",
      ...colorFieldWidget.dropdownOptions,
      type: Dropdown,
      relatedElement: this.input,
      items: {
        type: ColorPicker,
        mod: "dropdown",
        ...this.props.picker,
        onColorClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          let touch = isTouchEvent();
          this.closeDropdown(e, () => {
            if (!touch) this.input.focus();
          });
        },
      },
      onFocusOut: () => {
        this.closeDropdown();
      },
      dismissAfterScroll: () => {
        this.closeDropdown();
      },
      firstChildDefinesHeight: true,
      firstChildDefinesWidth: true,
    };

    return (this.dropdown = Widget.create(dropdown));
  }

  render(): React.ReactNode {
    let { instance, label, help, data } = this.props;
    let { widget, state } = instance;
    let {
      CSS,
      baseClass,
      suppressErrorsUntilVisited,
      showClear,
      alwaysShowClear,
    } = widget as ColorField;

    let insideButton;
    if (!data.readOnly && !data.disabled) {
      if (
        showClear &&
        (((!data.required || alwaysShowClear) && !data.empty) ||
          instance.state?.inputError)
      )
        insideButton = (
          <div
            className={CSS.element(baseClass, "clear")}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              this.onClearClick(e);
            }}
          >
            <ClearIcon className={CSS.element(baseClass, "icon")} />
          </div>
        );
      else
        insideButton = (
          <div className={CSS.element(baseClass, "right-icon")}>
            <DropdownIcon className={CSS.element(baseClass, "icon")} />
          </div>
        );
    }

    let well = (
      <div className={CSS.element(baseClass, "left-icon")}>
        <div style={{ backgroundColor: data.value as string }}></div>
      </div>
    );

    let dropdown: React.ReactNode | false = false;
    if (this.state.dropdownOpen)
      dropdown = (
        <Cx
          widget={this.getDropdown()}
          parentInstance={instance}
          options={{ name: "colorfield-dropdown" }}
          subscribe
        />
      );

    let empty = this.input ? !this.input.value : data.empty;

    return (
      <div
        className={CSS.expand(
          data.classNames,
          CSS.state({
            visited: state?.visited,
            focus: this.state.focus || this.state.dropdownOpen,
            icon: true,
            empty: empty && !data.placeholder,
            error:
              data.error &&
              (state?.visited || !suppressErrorsUntilVisited || !empty),
          }),
        )}
        style={data.style as React.CSSProperties}
        onMouseDown={this.onMouseDown.bind(this)}
        onTouchStart={stopPropagation}
        onClick={stopPropagation}
      >
        <input
          id={data.id as string}
          ref={(el) => {
            this.input = el!;
          }}
          type="text"
          className={CSS.expand(
            CSS.element(baseClass, "input"),
            data.inputClass,
          )}
          style={data.inputStyle as React.CSSProperties}
          defaultValue={this.trim((data.value as string) || "")}
          disabled={data.disabled as boolean}
          readOnly={data.readOnly as boolean}
          tabIndex={data.tabIndex as number}
          placeholder={data.placeholder as string}
          {...(data.inputAttrs as Record<string, any>)}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            this.onChange((e.target as HTMLInputElement).value, "input")
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            this.onChange((e.target as HTMLInputElement).value, "change")
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            this.onKeyDown(e)
          }
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            this.onBlur(e);
          }}
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            this.onFocus(e);
          }}
          onMouseMove={(e: React.MouseEvent<HTMLInputElement>) => {
            const tooltip = getFieldTooltip(instance);
            tooltipMouseMove(e, tooltip[0], tooltip[1]);
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLInputElement>) => {
            const tooltip = getFieldTooltip(instance);
            tooltipMouseLeave(e, tooltip[0], tooltip[1]);
          }}
        />
        {well}
        {insideButton}
        {dropdown}
        {label}
        {help}
      </div>
    );
  }

  onMouseDown(e: React.MouseEvent): void {
    e.stopPropagation();
    if (this.state.dropdownOpen) this.closeDropdown(e);
    else {
      this.openDropdownOnFocus = true;
    }

    //icon click
    if (e.target != this.input) {
      e.preventDefault();
      if (!this.state.dropdownOpen) this.openDropdown(e);
      else this.input.focus();
    }
  }

  onFocus(e: React.FocusEvent): void {
    if (this.openDropdownOnFocus) this.openDropdown(e);

    let { instance } = this.props;
    let { widget } = instance;
    const colorFieldWidget = widget as ColorField;

    if (colorFieldWidget.trackFocus) {
      this.setState({
        focus: true,
      });
    }
  }

  onKeyDown(e: React.KeyboardEvent): void {
    let { instance } = this.props;
    if ((instance.widget as ColorField).handleKeyDown(e, instance) === false)
      return;

    switch (e.keyCode) {
      case KeyCode.enter:
        e.stopPropagation();
        this.onChange((e.target as HTMLInputElement).value, "enter");
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

  onBlur(e: React.FocusEvent): void {
    if (this.state.focus)
      this.setState({
        focus: false,
      });
    this.onChange((e.target as HTMLInputElement).value, "blur");
  }

  closeDropdown(
    e?: React.KeyboardEvent | React.MouseEvent,
    callback?: () => void,
  ): void {
    if (this.state.dropdownOpen) {
      if (this.scrollableParents)
        this.scrollableParents.forEach((el) => {
          el.removeEventListener("scroll", this.updateDropdownPosition);
        });

      this.setState({ dropdownOpen: false }, callback);
    } else if (callback) callback();
  }

  openDropdown(
    e: React.KeyboardEvent | React.FocusEvent | React.MouseEvent,
  ): void {
    let { data } = this.props;
    this.openDropdownOnFocus = false;

    if (!this.state.dropdownOpen && !(data.disabled || data.readOnly)) {
      this.setState({ dropdownOpen: true });
    }
  }

  trim(value: string): string {
    return value.replace(/\s/g, "");
  }

  UNSAFE_componentWillReceiveProps(props: ColorInputProps): void {
    let { data, instance } = props;
    let { state } = instance;
    let nv = this.trim((data.value as string) || "");
    if (
      nv != this.input.value &&
      (this.data.value != data.value || !state?.inputError)
    ) {
      this.input.value = nv;
      instance.setState({
        inputError: false,
      });
    }
    this.data = data;

    const tooltip1 = getFieldTooltip(instance);
    tooltipParentWillReceiveProps(this.input, tooltip1[0], tooltip1[1]);
  }

  componentDidMount(): void {
    const tooltip2 = getFieldTooltip(this.props.instance);
    tooltipParentDidMount(this.input, tooltip2[0], tooltip2[1]);
    if (
      (this.props.instance.widget as ColorField).autoFocus &&
      !isTouchDevice()
    )
      this.input.focus();
  }

  componentWillUnmount(): void {
    if (
      this.input == getActiveElement() &&
      this.input.value != this.props.data.value
    ) {
      this.onChange(this.input.value, "blur");
    }
    tooltipParentWillUnmount(this.props.instance);
  }

  onClearClick(e: React.MouseEvent): void {
    let { instance } = this.props;
    instance.set("value", (instance.widget as ColorField).emptyValue);
    instance.setState({
      inputError: false,
    });
    e.stopPropagation();
    e.preventDefault();
  }

  onChange(inputValue: string, eventType: string): void {
    let { instance, data } = this.props;
    let { widget } = instance;

    if (eventType == "blur") {
      instance.setState({ visited: true });
    }

    let isValid;
    try {
      parseColor(inputValue);
      isValid = true;
    } catch (e) {
      isValid = false;
    }

    if (eventType == "blur" || eventType == "enter") {
      let value = inputValue || (widget as ColorField).emptyValue;
      if (isValid && value !== data.value) instance.set("value", value);

      instance.setState({
        inputError: !isValid && "Invalid color entered.",
      });
    }
  }
}
