import { Axis } from "./Axis";
import { VDOM } from "../../ui/Widget";
import { isUndefined } from "../../util/isUndefined";
import { isArray } from "../../util/isArray";
import { Format } from "../../util/Format";

export class CategoryAxis extends Axis {
   declareData() {
      super.declareData(...arguments, {
         inverted: undefined,
         uniform: undefined,
         names: undefined,
         values: undefined,
         minSize: undefined,
         categoryCount: undefined,
         format: undefined,
      });
   }

   initInstance(context, instance) {
      instance.calculator = new CategoryScale();
   }

   explore(context, instance) {
      super.explore(context, instance);
      var { values, names, inverted, uniform, minSize } = instance.data;
      instance.calculator.reset(inverted, uniform, values, names, minSize, this.minTickDistance, this.minLabelDistance);
   }

   reportData(context, instance) {
      instance.set("categoryCount", instance.calculator.valueList.length);
   }

   render(context, instance, key) {
      var { data, calculator } = instance;

      if (!data.bounds.valid()) return null;

      let labelGetter = (v) => calculator.names[v] ?? v;
      let labelFormatter = labelGetter;
      if (data.format) {
         let formatter = Format.parse(data.format);
         labelFormatter = (v) => formatter(labelGetter(v));
      }
      return (
         <g key={key} className={data.classNames} style={data.style}>
            {this.renderTicksAndLabels(context, instance, labelFormatter)}
         </g>
      );
   }
}

CategoryAxis.prototype.baseClass = "categoryaxis";
CategoryAxis.prototype.anchors = "0 1 1 0";
CategoryAxis.prototype.vertical = false;
CategoryAxis.prototype.inverted = false;
CategoryAxis.prototype.uniform = false;
CategoryAxis.prototype.labelOffset = 10;
CategoryAxis.prototype.labelRotation = 0;
CategoryAxis.prototype.labelAnchor = "auto";
CategoryAxis.prototype.labelDx = "auto";
CategoryAxis.prototype.labelDy = "auto";
CategoryAxis.prototype.minSize = 1;
CategoryAxis.prototype.minLabelDistanceHorizontal = 0;
CategoryAxis.prototype.minLabelDistanceVertical = 0;
CategoryAxis.prototype.minTickDistance = 0;

Axis.alias("category", CategoryAxis);

class CategoryScale {
   reset(inverted, uniform, values, names, minSize, minTickDistance, minLabelDistance) {
      this.padding = 0.5;
      delete this.min;
      delete this.max;
      delete this.minValue;
      delete this.maxValue;
      this.minSize = minSize;
      this.valuesMap = {};
      this.valueList = [];
      this.inverted = inverted;
      this.uniform = uniform;
      this.valueStacks = {};
      this.names = {};
      this.minTickDistance = minTickDistance;
      this.minLabelDistance = minLabelDistance;

      if (values) {
         if (isArray(values)) values.forEach((v) => this.acknowledge(v));
         else if (typeof values == "object")
            for (var k in values) {
               this.acknowledge(k);
               this.names[k] = values[k];
            }
      }

      if (names) {
         if (isArray(names)) {
            values = values || [];
            names.forEach((name, index) => {
               var value = values[index];
               this.names[value != null ? value : index] = name;
            });
         } else this.names = names;
      }
   }

   decodeValue(n) {
      return n;
   }

   encodeValue(v) {
      return v;
   }

   map(v, offset = 0) {
      var index = this.valuesMap[v] || 0;

      return this.origin + (index + offset - this.min + this.padding) * this.factor;
   }

   measure(a, b) {
      this.a = a;
      this.b = b;

      if (this.min == null) this.min = this.minValue || 0;

      if (this.max == null) this.max = !isNaN(this.maxValue) ? this.maxValue : 100;

      var sign = this.inverted ? -1 : 1;

      if (this.max - this.min + 1 < this.minSize) {
         this.factor = (sign * (this.b - this.a)) / this.minSize;
         this.origin = (this.b + this.a) * 0.5 - (this.factor * (this.max - this.min + 1)) / 2;
      } else {
         this.factor = (sign * (this.b - this.a)) / (this.max - this.min + 2 * this.padding);
         this.origin = (this.a * (1 + sign)) / 2 + (this.b * (1 - sign)) / 2; //a || b
      }

      this.tickSizes = [];
      let tickMultiplier = [1, 2, 5];
      let absFactor = Math.abs(this.factor);
      for (let base = 1; base < 10000 && this.tickSizes.length < 2; base *= 10) {
         for (let m of tickMultiplier) {
            if (base * m * absFactor >= this.minTickDistance && this.tickSizes.length == 0)
               this.tickSizes.push(base * m);
            if (base * m * absFactor >= this.minLabelDistance) {
               this.tickSizes.push(base * m);
               break;
            }
         }
      }
   }

   hash() {
      return {
         origin: this.origin,
         factor: this.factor,
         min: this.min,
         minSize: this.minSize,
         padding: this.padding,
         values: this.valueList.join(":"),
         names: JSON.stringify(this.names),
      };
   }

   isSame(x) {
      var h = this.hash();
      var same = x && !Object.keys(h).some((k) => x[k] !== h[k]);
      this.shouldUpdate = !same;
      return same;
   }

   acknowledge(value, width = 0, offset = 0) {
      var index = this.valuesMap[value];
      if (isUndefined(index)) {
         index = this.valueList.length;
         this.valueList.push(value);
         this.valuesMap[value] = index;
      }

      if (this.minValue == null || index < this.minValue) {
         this.minValue = index;
         this.padding = Math.max(this.padding, Math.abs(offset - width / 2));
      }

      if (this.maxValue == null || index > this.maxValue) {
         this.maxValue = index;
         this.padding = Math.max(this.padding, Math.abs(offset + width / 2));
      }
   }

   book(value, name) {
      if (this.uniform) value = 0;

      var stack = this.valueStacks[value];
      if (!stack)
         stack = this.valueStacks[value] = {
            index: {},
            count: 0,
         };
      if (!stack.index.hasOwnProperty(name)) stack.index[name] = stack.count++;
   }

   locate(value, name) {
      if (this.uniform) value = 0;

      var stack = this.valueStacks[value];
      if (!stack) return [0, 1];

      return [stack.index[name], stack.count];
   }

   trackValue(v, offset = 0, constrain = false) {
      let index = Math.round((v - this.origin) / this.factor - offset + this.min - this.padding);
      if (index < this.min) index = this.min;
      if (index > this.max) index = this.max;
      return this.valueList[index];
   }

   findTickSize(minPxDist) {
      for (let tickSize of this.tickSizes) if (tickSize * Math.abs(this.factor) >= minPxDist) return tickSize;
      return 1;
   }

   getTickSizes() {
      return this.tickSizes;
   }

   getTicks(tickSizes) {
      return tickSizes.map((size) => this.valueList.filter((_, i) => i % size == 0));
   }

   mapGridlines() {
      let result = [];
      if (this.tickSizes.length == 0) return result;
      let step = this.tickSizes[0];
      for (let index = this.min; index <= this.max + 1; index += step)
         result.push(this.origin + (index - 0.5 - this.min + this.padding) * this.factor);
      return result;
   }
}
