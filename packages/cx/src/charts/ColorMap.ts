import { Widget, WidgetConfig } from "../ui/Widget";
import { PureContainer, PureContainerBase, PureContainerConfig } from "../ui/PureContainer";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { Prop, NumberProp, DataRecord } from "../ui/Prop";

export interface ColorMapConfig extends WidgetConfig {
   /** A callback function used to get a cache object for storing color maps across renders. */
   onGetCache?: string | (() => DataRecord);

   /** An array of names to pre-register in the color map. */
   names?: Prop<string[]>;

   /** The step value for color indexing. If not specified, it's calculated based on the number of entries. */
   step?: NumberProp;

   /** The starting offset for color indexing. Default is 0. */
   offset?: NumberProp;

   /** The size of the color palette. Default is 16. */
   size?: NumberProp;
}

export interface ColorMapInstance extends Instance {
   colorMaps?: { [key: string]: ColorIndex };
}

export class ColorMap extends Widget<ColorMapConfig> {
   declare offset: number;
   declare step: number | null;
   declare size: number;
   declare onGetCache?: ColorMapConfig["onGetCache"];

   static Scope: typeof ColorMapScope;

   constructor(config?: ColorMapConfig) {
      super(config);
   }

   declareData(...args: any[]) {
      super.declareData(...args, {
         names: undefined,
         offset: undefined,
         step: undefined,
         size: undefined,
      });
   }

   explore(context: RenderingContext, instance: Instance) {
      if (!context.colorMaps) context.colorMaps = {};

      context.getColorMap = (colorMap: string) => {
         let map = (context.colorMaps as any)[colorMap] as ColorIndex | undefined;
         if (!map) {
            let cache: { [key: string]: ColorIndex } = this.onGetCache ? instance.invoke("onGetCache") : {};
            map = cache[colorMap];
            if (!map) {
               let { data } = instance;
               const d = data as any;
               map = (context.colorMaps as any)[colorMap] = cache[colorMap] = new ColorIndex({
                  offset: d.offset,
                  step: d.step,
                  size: d.size,
               });
            }
            const names = (instance.data as any).names;
            if (Array.isArray(names)) names.forEach((name: string) => map!.acknowledge(name));
         }
         return map;
      };
   }

   render() {
      return null;
   }
}

ColorMap.prototype.offset = 0;
ColorMap.prototype.step = null;
ColorMap.prototype.size = 16;

export interface ColorMapScopeConfig extends PureContainerConfig {}

export class ColorMapScope extends PureContainerBase<ColorMapScopeConfig, ColorMapInstance> {
   constructor(config?: ColorMapScopeConfig) {
      super(config);
   }

   explore(context: RenderingContext, instance: ColorMapInstance) {
      context.push("colorMaps", (instance.colorMaps = {}));
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: ColorMapInstance) {
      context.pop("colorMaps");
   }

   prepare(context: RenderingContext, instance: ColorMapInstance) {
      context.push("colorMaps", instance.colorMaps);
   }

   prepareCleanup(context: RenderingContext, instance: ColorMapInstance) {
      context.pop("colorMaps");
   }
}

ColorMap.Scope = ColorMapScope;
Widget.alias("color-map", ColorMap);

export interface ColorIndexConfig {
   offset: number;
   step: number | null;
   size: number;
}

export class ColorIndex {
   colorMap: { [key: string]: number };
   dirty: boolean;
   offset: number;
   step: number | null;
   size: number;

   constructor({ offset, step, size }: ColorIndexConfig) {
      this.colorMap = {};
      this.dirty = true;
      this.offset = offset;
      this.step = step;
      this.size = size;
   }

   acknowledge(name: string) {
      if (!(name in this.colorMap)) {
         this.colorMap[name] = Object.keys(this.colorMap).length;
         this.dirty = true;
      }
   }

   map(name: string): number {
      if (this.dirty) {
         this.dirty = false;
         if (!this.step) {
            let n = Object.keys(this.colorMap).length;
            this.step = n > 0 ? this.size / n : 1;
         }
      }

      let index = this.colorMap[name] || 0;
      return Math.round(this.offset + this.step! * index + this.size) % this.size;
   }
}
