/** @jsxImportSource react */
import { Widget, VDOM } from "../../ui/Widget";
import { Field, FieldConfig, FieldInstance } from "./Field";
import { captureMouseOrTouch, getCursorPos } from "../overlay/captureMouse";
import { hslToRgb } from "../../util/color/hslToRgb";
import { rgbToHsl } from "../../util/color/rgbToHsl";
import { rgbToHex } from "../../util/color/rgbToHex";
import { parseColor } from "../../util/color/parseColor";
import { getVendorPrefix } from "../../util/getVendorPrefix";
import { stopPropagation } from "../../util/eventCallbacks";
import { isString } from "../../util/isString";
import { getTopLevelBoundingClientRect } from "../../util/getTopLevelBoundingClientRect";
import PixelPickerIcon from "../icons/pixel-picker";
import type { RenderingContext } from "../../ui/RenderingContext";
import type { Instance } from "../../ui/Instance";
import { StringProp } from "../../ui/Prop";

// Type declaration for EyeDropper API
declare global {
   class EyeDropper {
      open(): Promise<{ sRGBHex: string }>;
   }
   interface Window {
      EyeDropper: typeof EyeDropper;
   }
}

//TODO: Increase HSL precision in calculations, round only RGB values
//TODO: Resolve alpha input problems

interface ColorState {
   r: number;
   g: number;
   b: number;
   h: number;
   s: number;
   l: number;
   a: number;
}

export interface ColorPickerConfig extends FieldConfig {
   /** Either `rgba`, `hsla` or `hex` value of the selected color. */
   value?: StringProp;

   /** Format of the color representation. Either `rgba`, `hsla` or `hex`. */
   format?: "rgba" | "hsla" | "hex";

   /**
    * A string containing the list of all events that cause that selected value is written to the store.
    * Default value is `blur change` which means that changes are propagated immediately.
    */
   reportOn?: string;

   /** Callback function invoked when the color preview is clicked. */
   onColorClick?: (e: React.MouseEvent, instance: Instance) => void;
}

export class ColorPicker extends Field<ColorPickerConfig, FieldInstance<ColorPicker>> {
   declare format: string;
   declare reportOn: string;
   declare onColorClick?: (e: React.MouseEvent, instance: FieldInstance<ColorPicker>) => void;

   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(
         {
            value: this.emptyValue,
            format: undefined,
         },
         ...args,
      );
   }

   renderInput(context: RenderingContext, instance: FieldInstance<ColorPicker>, key: string): React.ReactNode {
      return <ColorPickerComponent key={key} instance={instance} />;
   }

   handleEvent(eventType: string, instance: FieldInstance<ColorPicker>, color: ColorState): void {
      let { data } = instance;
      if (this.reportOn.indexOf(eventType) != -1) {
         let value;
         switch (data.format) {
            default:
            case "rgba":
               value = `rgba(${color.r.toFixed(0)},${color.g.toFixed(0)},${color.b.toFixed(0)},${
                  Math.round(color.a * 100) / 100
               })`;
               break;

            case "hsla":
               value = `hsla(${color.h.toFixed(0)},${color.s.toFixed(0)}%,${color.l.toFixed(0)}%,${
                  Math.round(color.a * 100) / 100
               })`;
               break;

            case "hex":
               value = rgbToHex(color.r, color.g, color.b);
               break;
         }
         instance.set("value", value);
      }
   }
}

ColorPicker.prototype.baseClass = "colorpicker";
ColorPicker.prototype.reportOn = "blur change";
ColorPicker.prototype.format = "rgba";

Widget.alias("color-picker", ColorPicker);

interface ColorPickerComponentProps {
   instance: FieldInstance<ColorPicker>;
}

class ColorPickerComponent extends VDOM.Component<ColorPickerComponentProps, ColorState> {
   data: Record<string, unknown>;

   constructor(props: ColorPickerComponentProps) {
      super(props);
      this.data = props.instance.data;
      try {
         this.state = this.parse(props.instance.data.value);
      } catch (e) {
         //if web colors are used (e.g. red), fallback to the default color
         this.state = this.parse(null);
      }
   }

   UNSAFE_componentWillReceiveProps(props: ColorPickerComponentProps): void {
      let { data } = props.instance;
      let color;
      try {
         color = this.parse(data.value);
      } catch {
         color = this.parse(null);
      }
      if (color.r != this.state.r || color.g != this.state.g || color.b != this.state.b || color.a != this.state.a)
         this.setState(color);
   }

   parse(color: string | null): ColorState {
      let c = parseColor(color);
      if (c == null) {
         c = {
            type: "rgba",
            r: 128,
            g: 128,
            b: 128,
            a: 0,
         };
      }

      c.a = Math.round(c.a * 100) / 100;

      if (c.type == "rgba") {
         let [h, s, l] = rgbToHsl(c.r, c.g, c.b);
         return { r: c.r, g: c.g, b: c.b, h, s, l, a: c.a };
      }

      if (c.type == "hsla") {
         let [r, g, b] = hslToRgb(c.h, c.s, c.l);
         r = this.fix255(r);
         g = this.fix255(g);
         b = this.fix255(b);
         return { r: r, g, b, h: c.h, s: c.s, l: c.l, a: c.a };
      }

      throw new Error(`Color ${color} parsing failed.`);
   }

   render(): React.ReactNode {
      let { h, s, l, a, r, g, b } = this.state;
      let { instance } = this.props;
      let { widget, data } = instance;
      let { CSS, baseClass } = widget;
      let hcolor = `hsl(${h},100%,50%)`;
      let hsla = `hsla(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%,${a})`;
      let rgba = `rgba(${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)},${a})`;
      let hex = rgbToHex(r, g, b);
      let pixelPicker;

      let alphaGradient = `${getVendorPrefix(
         "css",
      )}linear-gradient(left, hsla(${h},${s}%,${l}%,0) 0%, hsla(${h},${s}%,${l}%,1) 100%)`;

      if ("EyeDropper" in window && window.EyeDropper) {
         pixelPicker = (
            <div
               className={CSS.element(baseClass, "pixel-picker")}
               onClick={(e) => {
                  const eyeDropper = new EyeDropper();
                  eyeDropper
                     .open()
                     .then((result: { sRGBHex: string }) => {
                        instance.set("value", result.sRGBHex);
                     })
                     .catch((e: any) => {});
               }}
            >
               <PixelPickerIcon />
            </div>
         );
      }

      return (
         <div
            className={data.classNames}
            style={data.style}
            onBlur={this.onBlur.bind(this)}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
         >
            <div
               className={CSS.element(baseClass, "picker")}
               style={{ backgroundColor: hcolor }}
               onMouseDown={this.onSLSelect.bind(this)}
               onTouchStart={this.onSLSelect.bind(this)}
            >
               <div
                  className={CSS.element(baseClass, "indicator")}
                  style={{
                     left: `calc(${s}% - 4px)`,
                     top: `calc(${100 - l}% - 4px)`,
                     borderColor: `rgba(${r < 128 ? 255 : 0}, ${g < 128 ? 255 : 0}, ${b < 128 ? 255 : 0}, 0.5)`,
                  }}
               />
            </div>
            <div className={CSS.element(baseClass, "details")}>
               <div
                  className={CSS.element(baseClass, "hue")}
                  onMouseDown={this.onHueSelect.bind(this)}
                  onTouchStart={this.onHueSelect.bind(this)}
                  onWheel={(e) => {
                     this.onWheel(e, "h", 10);
                  }}
               >
                  <div
                     className={CSS.element(baseClass, "indicator")}
                     style={{
                        left: `calc(${h / 3.6}% - 2px)`,
                     }}
                  />
               </div>
               <div className={CSS.element(baseClass, "inputs")}>
                  <label>
                     {"H "}
                     <input
                        value={h.toFixed(0)}
                        onChange={(e) => {
                           this.onNumberChange(e, "h");
                        }}
                        onWheel={(e) => {
                           this.onWheel(e, "h", 10);
                        }}
                     />
                  </label>
                  <label>
                     {"S "}
                     <input
                        value={s.toFixed(0)}
                        onChange={(e) => {
                           this.onNumberChange(e, "s");
                        }}
                        onWheel={(e) => {
                           this.onWheel(e, "s", 5);
                        }}
                     />
                  </label>
                  <label>
                     {"L "}
                     <input
                        value={l.toFixed(0)}
                        onChange={(e) => {
                           this.onNumberChange(e, "l");
                        }}
                        onWheel={(e) => {
                           this.onWheel(e, "l", 5);
                        }}
                     />
                  </label>
                  <label>
                     {"A "}
                     <input
                        value={a}
                        onChange={(e) => {
                           this.onNumberChange(e, "a");
                        }}
                        onWheel={(e) => {
                           this.onWheel(e, "a", 0.1);
                        }}
                     />
                  </label>
               </div>
               <div
                  className={CSS.element(baseClass, "alpha")}
                  onMouseDown={this.onAlphaSelect.bind(this)}
                  onTouchStart={this.onAlphaSelect.bind(this)}
                  onWheel={(e) => {
                     this.onWheel(e, "a", 0.1);
                  }}
               >
                  <div style={{ background: alphaGradient }} />
                  <div
                     className={CSS.element(baseClass, "indicator")}
                     style={{
                        left: `calc(${a * 100}% - 2px)`,
                     }}
                  />
               </div>
               <div className={CSS.element(baseClass, "inputs")}>
                  <label>
                     {"R "}
                     <input
                        value={r.toFixed(0)}
                        onChange={(e) => {
                           this.onNumberChange(e, "r");
                        }}
                        onWheel={(e) => {
                           this.onWheel(e, "r", 5);
                        }}
                     />
                  </label>
                  <label>
                     {"G "}
                     <input
                        value={g.toFixed(0)}
                        onChange={(e) => {
                           this.onNumberChange(e, "g");
                        }}
                        onWheel={(e) => {
                           this.onWheel(e, "g", 5);
                        }}
                     />
                  </label>
                  <label>
                     {"B "}
                     <input
                        value={b.toFixed(0)}
                        onChange={(e) => {
                           this.onNumberChange(e, "b");
                        }}
                        onWheel={(e) => {
                           this.onWheel(e, "b", 5);
                        }}
                     />
                  </label>
                  <label>
                     {"A "}
                     <input
                        value={a}
                        onChange={(e) => {
                           this.onNumberChange(e, "a");
                        }}
                        onWheel={(e) => {
                           this.onWheel(e, "a", 0.1);
                        }}
                     />
                  </label>
               </div>
               <div className={CSS.element(baseClass, "preview")}>
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                     }}
                  >
                     <div
                        className={CSS.element(baseClass, "color")}
                        onClick={(e) => {
                           this.onColorClick(e);
                        }}
                     >
                        <div style={{ backgroundColor: hsla }}></div>
                     </div>
                  </div>
                  <div className={CSS.element(baseClass, "values")}>
                     <input value={hsla} readOnly />
                     <input value={rgba} readOnly />
                     <input value={hex} readOnly />
                  </div>
                  {pixelPicker}
               </div>
            </div>
         </div>
      );
   }

   onColorClick(e: React.MouseEvent): void {
      let { instance } = this.props;
      let { widget } = instance;

      if ((widget as ColorPicker).onColorClick) (widget as ColorPicker).onColorClick!(e, instance);
   }

   onHueSelect(e: React.MouseEvent | React.TouchEvent): void {
      e.preventDefault();
      e.stopPropagation();

      let el = e.currentTarget;
      let bounds = el.getBoundingClientRect();

      let move = (e: MouseEvent) => {
         let pos = getCursorPos(e);
         let x = Math.max(0, Math.min(1, (pos.clientX + 1 - bounds.left) / (el as HTMLElement).offsetWidth));
         this.setColorProp({
            h: x * 360,
         });
      };

      captureMouseOrTouch(e, move);
      move(e as any);
   }

   onAlphaSelect(e: React.MouseEvent | React.TouchEvent): void {
      e.preventDefault();
      e.stopPropagation();

      let el = e.currentTarget;
      let bounds = getTopLevelBoundingClientRect(el);

      let move = (e: MouseEvent | React.MouseEvent) => {
         let pos = getCursorPos(e);
         let x = Math.max(0, Math.min(1, (pos.clientX + 1 - bounds.left) / (el as HTMLElement).offsetWidth));
         this.setColorProp({
            a: x,
         });
      };

      captureMouseOrTouch(e, move);
      move(e as any);
   }

   onSLSelect(e: React.MouseEvent | React.TouchEvent): void {
      e.preventDefault();
      e.stopPropagation();

      let el = e.currentTarget;
      let bounds = getTopLevelBoundingClientRect(el);

      let move = (e: MouseEvent) => {
         let pos = getCursorPos(e);
         let x = Math.max(0, Math.min(1, (pos.clientX + 1 - bounds.left) / (el as HTMLElement).offsetWidth));
         let y = Math.max(0, Math.min(1, (pos.clientY + 1 - bounds.top) / (el as HTMLElement).offsetWidth));
         let s = x;
         let l = 1 - y;
         this.setColorProp({
            s: s * 100,
            l: l * 100,
         });
      };

      captureMouseOrTouch(e, move);
      move(e as any);
   }

   fix255(v: number): number {
      return Math.max(0, Math.min(255, Math.round(v)));
   }

   setColorProp(props: string | Partial<ColorState>, value?: number): void {
      let propsObj: Partial<ColorState>;
      if (isString(props)) {
         propsObj = {
            [props]: value,
         };
      } else {
         propsObj = props;
      }

      let state = { ...this.state };
      let fixAlpha = false;

      for (let prop in propsObj) {
         let propValue = propsObj[prop as keyof ColorState];
         if (propValue === undefined) continue;

         switch (prop) {
            case "h":
               state.h = Math.min(360, Math.max(0, propValue));
               [state.r, state.g, state.b] = hslToRgb(state.h, state.s, state.l);
               fixAlpha = true;
               break;

            case "s":
               state.s = Math.min(100, Math.max(0, propValue));
               [state.r, state.g, state.b] = hslToRgb(state.h, state.s, state.l);
               fixAlpha = true;
               break;

            case "l":
               state.l = Math.min(100, Math.max(0, propValue));
               [state.r, state.g, state.b] = hslToRgb(state.h, state.s, state.l);
               fixAlpha = true;
               break;

            case "r":
            case "g":
            case "b":
               state[prop] = Math.round(Math.min(255, Math.max(0, propValue)));
               let [h, s, l] = rgbToHsl(state.r, state.g, state.b);
               state.h = h;
               state.s = s;
               state.l = l;
               fixAlpha = true;
               break;

            case "a":
               state.a = Math.round(100 * Math.min(1, Math.max(0, propValue))) / 100;
               break;
         }
      }

      state.r = this.fix255(state.r);
      state.g = this.fix255(state.g);
      state.b = this.fix255(state.b);

      if (fixAlpha && state.a === 0) state.a = 1;

      this.setState(state, () => {
         (this.props.instance.widget as ColorPicker).handleEvent("change", this.props.instance, this.state);
      });
   }

   onNumberChange(e: React.ChangeEvent<HTMLInputElement>, prop: keyof ColorState): void {
      e.preventDefault();
      e.stopPropagation();
      let number = parseFloat(e.target.value || "0");
      this.setColorProp(prop, number);
   }

   onWheel(e: React.WheelEvent, prop: keyof ColorState, delta: number): void {
      e.preventDefault();
      e.stopPropagation();
      let factor = e.deltaY < 0 ? 1 : -1;
      this.setColorProp(prop, this.state[prop] + delta * factor);
   }

   onBlur(): void {
      (this.props.instance.widget as ColorPicker).handleEvent("blur", this.props.instance, this.state);
   }
}
