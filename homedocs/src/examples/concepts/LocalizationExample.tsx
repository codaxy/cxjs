import { createModel } from "cx/data";
import { ContentResolver, Controller, Culture, LabelsTopLayout } from "cx/ui";
import { Calendar, LookupField, NumberField, enableTooltips } from "cx/widgets";

enableTooltips();

// @model
interface Option {
  id: string;
  text: string;
}

interface PageModel {
  number: number;
  date: string;
  culture: Option;
  cultures: Option[];
  currency: Option;
  currencies: Option[];
}

const m = createModel<PageModel>();

// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.set(m.number, 123456.78);
    this.store.set(m.date, new Date().toISOString());

    this.store.set(m.cultures, [
      { id: "en-us", text: "English (US)" },
      { id: "de-de", text: "German" },
      { id: "es-es", text: "Spanish" },
      { id: "fr-fr", text: "French" },
    ]);
    this.store.set(m.culture, { id: "en-us", text: "English (US)" });

    this.store.set(m.currencies, [
      { id: "USD", text: "USD" },
      { id: "EUR", text: "EUR" },
      { id: "GBP", text: "GBP" },
    ]);
    this.store.set(m.currency, { id: "USD", text: "USD" });
  }
}
// @controller-end

// @index
export default (
  <div>
    <LabelsTopLayout columns={2} controller={PageController}>
      <LookupField
        value={m.culture.id}
        options={m.cultures}
        label="Culture"
        required
      />
      <LookupField
        value={m.currency.id}
        options={m.currencies}
        label="Currency"
        required
      />
    </LabelsTopLayout>
    <ContentResolver
      params={{ culture: m.culture.id, currency: m.currency.id }}
      onResolve={async ({ culture, currency }) => {
        //console.log(culture, currency);
        Culture.setCulture(culture);
        Culture.setDefaultCurrency(currency);

        switch (culture) {
          case "de-de":
            await import("cx/locale/de-de.js");
            break;
          case "es-es":
            await import("cx/locale/es-es.js");
            break;
          case "fr-fr":
            await import("cx/locale/fr-fr.js");
            break;
          default:
            await import("cx/locale/en-us.js");
            break;
        }

        return (
          <LabelsTopLayout columns={2} controller={PageController}>
            <NumberField value={m.number} label="Number" />
            <NumberField value={m.number} label="Currency" format="currency" />
            <Calendar value={m.date} label="Date" />
          </LabelsTopLayout>
        );
      }}
    />
  </div>
);
// @index-end
