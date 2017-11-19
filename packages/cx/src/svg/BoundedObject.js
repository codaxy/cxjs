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
   
   calculateBounds(context, instance) {
      var {data} = instance;
      return Rect.add(Rect.add(Rect.multiply(instance.parentRect, data.anchors), data.offset), data.margin);
   }

   prepareBounds(context, instance) {
      var {data} = instance;
      if (instance.shouldUpdate || !instance.cached.parentRect || !instance.cached.parentRect.isEqual(context.parentRect) || !data.bounds) {
         if (!context.parentRect)
            throw new Error('Parent bounds were not provided through the context.');
         instance.parentRect = context.parentRect;
         instance.cache('parentRect' , context.parentRect);
         instance.markShouldUpdate(context);
         data.bounds = this.calculateBounds(context, instance);
         data.childrenBounds = Rect.add(data.bounds, data.padding);
      }
   }

   prepare(context, instance) {
      this.prepareBounds(context, instance);
      context.push('parentRect', instance.data.childrenBounds);
   }

   prepareCleanup(context, instance) {
      context.pop('parentRect');
   }
}

BoundedObject.prototype.anchors = 0;
BoundedObject.prototype.margin = 0;
BoundedObject.prototype.offset = 0;
BoundedObject.prototype.padding = 0;
BoundedObject.prototype.styled = true;

