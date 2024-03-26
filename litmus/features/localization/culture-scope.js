import {
   PureContainer,
   createCulture,
   enableCultureSensitiveFormatting,
   popCulture,
   pushCulture,
   CultureScope,
} from "cx/ui";
import { Button } from "cx/widgets";

enableCultureSensitiveFormatting();

// class CultureScope extends PureContainer {
//    init() {
//       this.initialItems = this.items ?? this.children;
//       delete this.items;
//       delete this.children;
//       super.init();
//    }

//    declareData(...args) {
//       super.declareData(...args, {
//          culture: undefined,
//          numberCulture: undefined,
//          dateTimeCulture: undefined,
//          defaultCurrency: undefined,
//       });
//    }

//    prepareData(context, instance) {
//       super.prepareData(context, instance);
//       this.clear();
//       let { data } = instance;

//       if (this.onCreateCulture) instance.culture = instance.invoke("onCreateCulture", data, instance);
//       else
//          instance.culture = createCulture({
//             culture: data.culture,
//             numberCulture: data.numberCulture,
//             dateTimeCulture: data.dateTimeCulture,
//             defaultCurrency: data.defaultCurrency,
//             dateEncoding: this.dateEncoding,
//          });
//    }

//    explore(context, instance) {
//       let { culture } = instance;
//       pushCulture(culture);
//       if (this.items.length == 0 && this.initialItems) this.add(this.initialItems);
//       super.explore(context, instance);
//    }

//    exploreCleanup(context, instance) {
//       popCulture();
//    }
// }

// CultureScope.prototype.culture = null;
// CultureScope.prototype.numberCulture = null;
// CultureScope.prototype.dateTimeCulture = null;
// CultureScope.prototype.defaultCurrency = null;
// CultureScope.prototype.dateEncoding = null;

export default (
   <cx>
      <div
         controller={{
            onInit() {
               this.store.init("today", new Date().toISOString());
               this.store.init("number", 123456.789);
            },
            onSetEnglish() {
               this.store.set("culture", "en");
            },
            onSetSerbian() {
               this.store.set("culture", "sr");
            },
            onSetGerman() {
               this.store.set("culture", "de");
            },
         }}
      >
         <Button onClick="onSetEnglish">English</Button>
         <Button onClick="onSetSerbian">Srpski</Button>
         <Button onClick="onSetGerman">German</Button>

         <div text-tpl="Date: {today:dt}" />
         <div text-tpl="Number: {number:n;4}" />

         <CultureScope culture-bind="culture">
            <div text-tpl="Date: {today:dt}" />
            <div text-tpl="Number: {number:n;4}" />
            <CultureScope culture="it-CH" numberCulture-bind="culture">
               <div text-tpl="Date: {today:dt}" />
               <div text-tpl="Number: {number:n;4}" />
            </CultureScope>
         </CultureScope>
      </div>
   </cx>
);
