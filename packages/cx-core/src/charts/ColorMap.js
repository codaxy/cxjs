import {Widget} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';

export class ColorMap extends Widget {
   init() {
      super.init();
      this.dirty = true;
   }

   explore(context, instance) {
      if (!context.colorMaps)
         context.colorMaps = {};

      context.getColorMap = (colorMap) => {
         var map = context.colorMaps[colorMap];
         if (!map)
            map = context.colorMaps[colorMap] = new ColorIndex();
         return map;
      }
   }

   render() {
      return null;
   }
}

export class ColorMapScope extends PureContainer {
   explore(context, instance) {
      var previous = context.colorMaps;
      instance.colorMaps = context.colorMaps = {};
      super.explore(context, instance);
      context.colorMaps = previous;
   }

   prepare(context, instance) {
      var previous = context.colorMaps;
      context.colorMaps = instance.colorMaps;
      super.prepare(context, instance);
      context.colorMaps = previous;
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