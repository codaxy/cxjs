// #1342: flipping the switch must update every field. Before the fix they kept their first values.
import { Culture, enableCultureSensitiveFormatting } from "cx/ui";
import { DateTimeField, NumberField, Switch } from "cx/widgets";

enableCultureSensitiveFormatting();

const date = "2026-04-24T12:00:00Z";

export default (
   <cx>
      <div
         controller={{
            onInit() {
               this.addTrigger(
                  "culture",
                  ["de"],
                  (de) => {
                     Culture.setDefaultTimezone(de ? "Asia/Tokyo" : "UTC");
                     Culture.setNumberCulture(de ? "de-DE" : "en-US");
                     Culture.setDateTimeCulture(de ? "de-DE" : "en-US");
                     Culture.setDefaultCurrency(de ? "EUR" : "USD");
                  },
                  true,
               );
            },
         }}
      >
         <Switch value-bind="de" text="Asia/Tokyo, de-DE, EUR" />
         <p>
            <DateTimeField value={date} format="datetime;HHmmN" readOnly /> 12:00 ↔ 21:00
         </p>
         <p>
            <DateTimeField value={date} format="date" readOnly /> 04/24/2026 ↔ 24.04.2026
         </p>
         <p>
            <NumberField value={1234.56} format="n;2" readOnly /> 1,234.56 ↔ 1.234,56
         </p>
         <p>
            <NumberField value={1234.56} format="currency;;2" readOnly /> $1,234.56 ↔ 1.234,56 €
         </p>
      </div>
   </cx>
);
