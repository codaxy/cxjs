import {Widget} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';

export class ColorMap extends Widget {
   declareData() {
      super.declareData(...arguments, {
         names: undefined,
         offset: undefined,
         step: undefined,
         size: undefined,
      })
   }

   explore(context, instance) {
      if (!context.colorMaps)
         context.colorMaps = {};

      context.getColorMap = (colorMap) => {
         let map = context.colorMaps[colorMap];
         if (!map) {
            let cache = this.onGetCache ? instance.invoke("onGetCache") : {};
            map = cache[colorMap];
            if (!map) {
               let {data} = instance;
               map = context.colorMaps[colorMap] = cache[colorMap] = new ColorIndex({
                  offset: data.offset,
                  step: data.step,
                  size: data.size
               });
            }
            if (Array.isArray(instance.data.names))
               instance.data.names.forEach(name => map.acknowledge(name));
         }
         return map;
      }
   }

   render() {
      return null;
   }
}

ColorMap.prototype.offset = 0;
ColorMap.prototype.step = null;
ColorMap.prototype.size = 16;

export class ColorMapScope extends PureContainer {
   explore(context, instance) {
      context.push('colorMaps', instance.colorMaps = {});
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop('colorMaps');
   }

   prepare(context, instance) {
      context.push('colorMaps', instance.colorMaps);
   }

   prepareCleanup(context, instance) {
      context.pop('colorMaps');
   }
}

ColorMap.Scope = ColorMapScope;
Widget.alias('color-map', ColorMap);

export class ColorIndex {
   constructor({offset, step, size}) {
      this.colorMap = {};
      this.dirty = true;
      this.offset = offset;
      this.step = step;
      this.size = size;
   }

   acknowledge(name) {
      if (!(name in this.colorMap)) {
         this.colorMap[name] = Object.keys(this.colorMap).length;
         this.dirty = true;
      }
   }

   map(name) {

      if (this.dirty) {
         this.dirty = false;
         if (!this.step) {
            let n = Object.keys(this.colorMap).length;
            this.step = n > 0 ? this.size / n : 1;
         }
      }

      let index = this.colorMap[name] || 0;
      return Math.round(this.offset + this.step * index + this.size) % this.size;

   }
}