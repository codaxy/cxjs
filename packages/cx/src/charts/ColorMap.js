import {Widget} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';

export class ColorMap extends Widget {
   declareData() {
      super.declareData(...arguments, {
         names: undefined
      })
   }

   explore(context, instance) {
      if (!context.colorMaps)
         context.colorMaps = {};

      context.getColorMap = (colorMap) => {
         var map = context.colorMaps[colorMap];
         if (!map) {
            let cache = this.onGetCache ? instance.invoke("onGetCache") : {};
            map = cache[colorMap];
            if (!map)
               map = context.colorMaps[colorMap] = cache[colorMap] = new ColorIndex();
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
   constructor() {
      this.colorMap = {};
      this.dirty = true;
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

         var n = Object.keys(this.colorMap).length;
         this.dist = n > 0 ? 16 / n : 1;
         this.offset = 0;
      }

      var index = this.colorMap[name];

      return Math.round(this.offset + this.dist * index) % 16;
   }
}