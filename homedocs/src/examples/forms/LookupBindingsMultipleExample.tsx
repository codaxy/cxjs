import { createModel } from "cx/data";
import { LabelsTopLayout, tpl } from "cx/ui";
import { LookupField, Repeater } from "cx/widgets";

// @model
interface City {
  id: number;
  text: string;
  population: number;
  landArea: number;
}

interface Model {
  selectedCities: City[];
  $option: City;
  $city: City;
}

const m = createModel<Model>();

const options: City[] = [
  { id: 1, text: "New York", population: 8336817, landArea: 783 },
  { id: 2, text: "Los Angeles", population: 3979576, landArea: 1213 },
  { id: 3, text: "Chicago", population: 2693976, landArea: 606 },
  { id: 4, text: "Houston", population: 2320268, landArea: 1707 },
  { id: 5, text: "Phoenix", population: 1680992, landArea: 1340 },
];
// @model-end

// @index
export default (
  <LabelsTopLayout vertical>
    <LookupField
      label="Select Cities"
      records={m.selectedCities}
      options={options}
      multiple
      bindings={[
        { key: true, local: "$value.id", remote: "$option.id" },
        { local: "$value.text", remote: "$option.text" },
        { local: "$value.population", remote: "$option.population" },
        { local: "$value.landArea", remote: "$option.landArea" },
      ]}
    />
    <Repeater records={m.selectedCities} recordAlias={m.$city}>
      <div class="border-b border-gray-300 py-2">
        <strong text={m.$city.text} />
        <div text={tpl(m.$city.population, "Population: {0:n;0}")} />
        <div text={tpl(m.$city.landArea, "Land Area: {0} km²")} />
      </div>
    </Repeater>
  </LabelsTopLayout>
);
// @index-end
