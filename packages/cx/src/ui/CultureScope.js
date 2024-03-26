import { createCulture, popCulture, pushCulture } from "./Culture";
import { PureContainer } from "./PureContainer";

export class CultureScope extends PureContainer {
   init() {
      this.initialItems = this.items ?? this.children;
      delete this.items;
      delete this.children;
      super.init();
   }

   declareData(...args) {
      super.declareData(...args, {
         culture: undefined,
         numberCulture: undefined,
         dateTimeCulture: undefined,
         defaultCurrency: undefined,
      });
   }

   prepareData(context, instance) {
      super.prepareData(context, instance);
      this.clear();
      let { data } = instance;

      if (this.onCreateCulture) instance.culture = instance.invoke("onCreateCulture", data, instance);
      else
         instance.culture = createCulture({
            culture: data.culture,
            numberCulture: data.numberCulture,
            dateTimeCulture: data.dateTimeCulture,
            defaultCurrency: data.defaultCurrency,
            dateEncoding: this.dateEncoding,
         });
   }

   explore(context, instance) {
      let { culture } = instance;
      pushCulture(culture);
      if (this.items.length == 0 && this.initialItems) this.add(this.initialItems);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      popCulture();
   }
}

CultureScope.prototype.culture = null;
CultureScope.prototype.numberCulture = null;
CultureScope.prototype.dateTimeCulture = null;
CultureScope.prototype.defaultCurrency = null;
CultureScope.prototype.dateEncoding = null;
