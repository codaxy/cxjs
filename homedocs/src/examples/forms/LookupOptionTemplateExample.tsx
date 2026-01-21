import { createModel } from "cx/data";
import { bind, LabelsTopLayout, tpl } from "cx/ui";
import { LookupField } from "cx/widgets";

// @model
interface City {
  id: number;
  text: string;
  population: number;
}

interface Model {
  selectedCityId: number;
  $option: City;
}

const m = createModel<Model>();

const options: City[] = [
  { id: 1, text: "New York", population: 8336817 },
  { id: 2, text: "Los Angeles", population: 3979576 },
  { id: 3, text: "Chicago", population: 2693976 },
  { id: 4, text: "Houston", population: 2320268 },
  { id: 5, text: "Phoenix", population: 1680992 },
];
// @model-end

// @index
export default () => (
  <LabelsTopLayout vertical>
    <LookupField
      label="Select a City"
      value={m.selectedCityId}
      options={options}
    >
      <div>
        <strong text={m.$option.text} />
        <div
          class="text-xs text-gray-500"
          text={tpl(m.$option.population, "Population: {0:n;0}")}
        />
      </div>
    </LookupField>
  </LabelsTopLayout>
);
// @index-end
