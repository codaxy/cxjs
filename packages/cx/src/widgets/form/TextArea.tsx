/** @jsxImportSource react */

import { Widget, VDOM, getContent } from "../../ui/Widget";
import { TextField } from "./TextField";
import { getFieldTooltip, FieldInstance } from "./Field";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount,
} from "../overlay/tooltip-ops";
import { stopPropagation } from "../../util/eventCallbacks";
import { KeyCode } from "../../util/KeyCode";
import { autoFocus } from "../autoFocus";
import { getActiveElement } from "../../util/getActiveElement";

export class TextArea extends TextField {
   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            rows: undefined,
         },
         ...args
      );
   }

   prepareData(context: RenderingContext, instance: FieldInstance<TextArea>): void {
      let { state, data, cached } = instance;
      if (!cached.data || data.value != cached.data.value) state.empty = !data.value;
      super.prepareData(context, instance);
   }

   renderInput(context: RenderingContext, instance: FieldInstance<TextArea>, key: string): React.ReactNode {
      return (
         <Input
            key={key}
            data={instance.data}
            instance={instance}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
         />
      );
   }

   validateRequired(context: RenderingContext, instance: Instance): string | undefined {
      return instance.state.empty && this.requiredText;
   }
}

TextArea.prototype.baseClass = "textarea";
TextArea.prototype.reactOn = "blur";
TextArea.prototype.suppressErrorsUntilVisited = true;

interface InputProps {
   instance: FieldInstance<TextArea>;
   data: Record<string, any>;
   label?: React.ReactNode;
   help?: React.ReactNode;
}

interface InputState {
   focus: boolean;
}

class Input extends VDOM.Component<InputProps, InputState> {
   input?: HTMLTextAreaElement;

   constructor(props: InputProps) {
      super(props);
      this.state = {
         focus: false,
      };
   }

   render(): React.ReactNode {
      let { instance, label, help } = this.props;
      let { widget, data, state } = instance;
      let { CSS, baseClass, suppressErrorsUntilVisited } = widget;

      let empty = this.input ? !this.input.value : data.empty;

      return (
         <div
            className={CSS.expand(
               data.classNames,
               CSS.state({
                  visited: state.visited,
                  focus: this.state.focus,
                  empty: empty && !data.placeholder,
                  error: data.error && (state.visited || !suppressErrorsUntilVisited || !empty),
               })
            )}
            style={data.style}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
         >
            <textarea
               className={CSS.element(baseClass, "input")}
               ref={(el: HTMLTextAreaElement | null) => {
                  this.input = el || undefined;
               }}
               id={data.id}
               rows={data.rows}
               style={data.inputStyle}
               defaultValue={data.value}
               disabled={data.disabled}
               readOnly={data.readOnly}
               tabIndex={data.tabIndex}
               placeholder={data.placeholder}
               {...data.inputAttrs}
               onInput={(e: React.FormEvent<HTMLTextAreaElement>) => this.onChange(e.currentTarget.value, "input")}
               onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => this.onChange(e.target.value, "change")}
               onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => this.onBlur(e)}
               onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => this.onFocus()}
               onClick={stopPropagation}
               onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => this.onKeyDown(e)}
               onMouseMove={(e: React.MouseEvent<HTMLTextAreaElement>) => tooltipMouseMove(e, ...getFieldTooltip(instance))}
               onMouseLeave={(e: React.MouseEvent<HTMLTextAreaElement>) => tooltipMouseLeave(e, ...getFieldTooltip(instance))}
            />
            {label}
            {help}
         </div>
      );
   }

   componentWillUnmount(): void {
      if (this.input == getActiveElement()) {
         this.onChange(this.input.value, "blur");
      }
      tooltipParentWillUnmount(this.props.instance);
   }

   componentDidMount(): void {
      tooltipParentDidMount(this.input!, ...getFieldTooltip(this.props.instance));
      autoFocus(this.input, this);
   }

   componentDidUpdate(): void {
      autoFocus(this.input, this);
   }

   onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
      let { instance } = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.down:
         case KeyCode.up:
         case KeyCode.left:
         case KeyCode.right:
            e.stopPropagation();
            break;
      }
   }

   UNSAFE_componentWillReceiveProps({ data, instance }: InputProps): void {
      if (data.value != this.props.data.value) {
         this.input!.value = data.value || "";
      }
      tooltipParentWillReceiveProps(this.input!, ...getFieldTooltip(instance));
   }

   onChange(inputValue: string, change: string): void {
      let { instance, data } = this.props;
      let { widget } = instance;

      if (change == "blur") {
         instance.setState({ visited: true });
         if (this.state.focus)
            this.setState({
               focus: false,
            });
      }

      if (data.required) {
         instance.setState({
            empty: !inputValue,
         });
      }

      if (instance.widget.reactOn.indexOf(change) != -1) {
         let value = inputValue || widget.emptyValue;
         instance.set("value", value);
      }
   }

   onFocus(): void {
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true,
         });

         instance.set("focused", true);
      }
   }

   onBlur(e: React.FocusEvent<HTMLTextAreaElement>): void {
      const { instance } = this.props;
      if (instance.widget.trackFocus) {
         instance.set("focused", false);
      }

      this.onChange(e.target.value, "blur");
   }
}

Widget.alias("textarea", TextArea);
