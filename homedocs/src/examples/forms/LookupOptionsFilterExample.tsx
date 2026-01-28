import { createModel } from "cx/data";
import { Controller, LabelsTopLayout } from "cx/ui";
import { Checkbox, Grid, LabeledContainer, LookupField } from "cx/widgets";

// @model
interface Country {
  name: string;
  code: string;
  capital: string;
  continent: string;
  active: boolean;
}

interface Model {
  countries: Country[];
  selectedCountry: string;
  $record: Country;
  allowOnlyActiveCountries: boolean;
}

const m = createModel<Model>();
// @model-end

// @controller
class PageController extends Controller {
  onInit() {
    this.store.init(m.countries, [
      {
        name: "Austria",
        code: "AT",
        capital: "Vienna",
        continent: "Europe",
        active: true,
      },
      {
        name: "Cyprus",
        code: "CY",
        capital: "Nicosia",
        continent: "Europe",
        active: true,
      },
      {
        name: "Bosnia and Herzegovina",
        code: "BA",
        capital: "Sarajevo",
        continent: "Europe",
        active: false,
      },
      {
        name: "Nicaragua",
        code: "NI",
        capital: "Managua",
        continent: "North America",
        active: true,
      },
      {
        name: "Morocco",
        code: "MA",
        capital: "Rabat",
        continent: "Africa",
        active: true,
      },
    ]);
  }
}
// @controller-end

// @index
export default (
  <div controller={PageController} class="space-y-6">
    <LabelsTopLayout vertical>
      <LabeledContainer label="Allowed Countries">
        <Grid
          records={m.countries}
          recordAlias={m.$record}
          columns={[
            {
              field: "active",
              header: "Active",
              items: <Checkbox value={m.$record.active} />,
              align: "center",
              defaultWidth: 70,
              pad: false,
            },
            { field: "name", header: "Country", defaultWidth: 200 },
            { field: "code", header: "Code", defaultWidth: 100 },
            { field: "continent", header: "Continent", defaultWidth: 120 },
          ]}
          scrollable
        />
      </LabeledContainer>
      <Checkbox
        value={m.allowOnlyActiveCountries}
        text="Allow only countries marked Active"
      />
      <LookupField
        label="Domicile"
        value={m.selectedCountry}
        options={m.countries}
        optionIdField="code"
        optionTextField="name"
        filterParams={{
          allowOnlyActiveCountries: m.allowOnlyActiveCountries,
          selection: m.selectedCountry,
        }}
        onCreateVisibleOptionsFilter={({
          allowOnlyActiveCountries,
          selection,
        }) => {
          if (allowOnlyActiveCountries)
            return (option: Country) =>
              option.code == selection || option.active;
          return () => true;
        }}
        minOptionsForSearchField={2}
      />
    </LabelsTopLayout>
  </div>
);
// @index-end
