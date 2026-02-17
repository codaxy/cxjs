import { createModel } from "cx/data";
import { bind, LabelsTopLayout, tpl } from "cx/ui";
import { isDefined } from "cx/util";
import { LookupField, PureContainer } from "cx/widgets";

// @model
interface City {
  id: number;
  text: string;
  population: number;
  landArea: number;
}

interface Model {
  city: City;
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
      label="Select a City"
      value={m.city.id}
      text={m.city.text}
      options={options}
      bindings={[
        { key: true, local: m.city.id, remote: "$option.id" },
        { local: m.city.text, remote: "$option.text" },
        { local: m.city.population, remote: "$option.population" },
        { local: m.city.landArea, remote: "$option.landArea" },
      ]}
    />

    <PureContainer if={isDefined(m.city.id)}>
      <div class="mt-2 space-y-1">
        <strong text={m.city.text} />
        <div text={tpl(m.city.population, "Population: {0:n;0}")} />
        <div text={tpl(m.city.landArea, "Land Area: {0} km²")} />
      </div>
    </PureContainer>
  </LabelsTopLayout>
);
// @index-end
