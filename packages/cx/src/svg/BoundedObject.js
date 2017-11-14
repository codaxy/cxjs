import {Widget, VDOM} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';
import {Rect} from './util/Rect';

export class BoundedObject extends PureContainer {

   declareData() {
      return super.declareData({
         anchors: undefined,
         offset: undefined,
         margin: undefined,
         padding: undefined
      }, ...arguments)
   }

   prepareData(context, instance) {
      super.prepareData(context, instance);
      var {data} = instance;
      data.anchors = Rect.convert(data.anchors);
      data.offset = Rect.convert(data.offset);
      data.margin = Rect.convertMargin(data.margin);
      data.padding = Rect.convertMargin(data.padding);
   }

   explore(context, instance) {
      this.exploreHelpers(context, instance);
      super.explore(context, instance);
   }
   
   calculateBounds(context, instance) {
      var {data} = instance;
      return Rect.add(Rect.add(Rect.multiply(instance.parentRect, data.anchors), data.offset), data.margin);
   }

   prepareBounds(context, instance) {
      var {data} = instance;
      if (instance.shouldUpdate || !instance.cached.parentRect || !instance.cached.parentRect.isEqual(context.parentRect) || !data.bounds) {
         instance.parentRect = context.parentRect;
         instance.shouldUpdate = true;
         data.bounds = this.calculateBounds(context, instance);
         data.childrenBounds = Rect.add(data.bounds, data.padding);
      }
   }

   prepare(context, instance) {
      var {data} = instance;

      if (!context.parentRect)
        throw new Error('Parent bounds were not provided through the context. Is there a parent Svg element up in the tree?');

      this.prepareBounds(context, instance);

      context.parentRect = data.childrenBounds;
      this.prepareHelpers(context, instance);
      super.prepare(context, instance);
      context.parentRect = instance.parentRect;
   }

   cleanup(context, instance) {
      instance.cached.parentRect = instance.parentRect;
      super.cleanup(context, instance);
      this.cleanupHelpers(context, instance);
   }

   exploreHelpers(context, instance) {

   }

   prepareHelpers(context, instance) {

   }

   cleanupHelpers(context, instance) {

   }
}

BoundedObject.prototype.anchors = 0;
BoundedObject.prototype.margin = 0;
BoundedObject.prototype.offset = 0;
BoundedObject.prototype.padding = 0;
BoundedObject.prototype.pure = false;
BoundedObject.prototype.styled = true;

