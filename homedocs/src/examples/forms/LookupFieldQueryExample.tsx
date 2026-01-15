import { createAccessorModelProxy } from "cx/data";
import { LabelsTopLayout } from "cx/ui";
import { getSearchQueryPredicate } from "cx/util";
import { LookupField } from "cx/widgets";

// @model
interface Model {
  cityId: number;
  cityText: string;
  cities: { id: number; text: string }[];
}

const m = createAccessorModelProxy<Model>();

const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Diego", "Dallas"].map(
  (text, id) => ({ id, text }),
);

function queryCity(query: string) {
  let predicate = getSearchQueryPredicate(query);
  return new Promise<typeof cities>((resolve) => {
    setTimeout(() => resolve(cities.filter((x) => predicate(x.text))), 300);
  });
}
// @model-end

// @index
export default () => (
  <LabelsTopLayout columns={2}>
    <LookupField
      label="Query on Each Keystroke"
      value={m.cityId}
      text={m.cityText}
      onQuery={queryCity}
      minQueryLength={2}
      placeholder="Type at least 2 chars..."
    />
    <LookupField
      label="Fetch Once, Filter Locally"
      records={m.cities}
      onQuery={queryCity}
      fetchAll
      cacheAll
      multiple
      placeholder="Type to filter..."
    />
  </LabelsTopLayout>
);
// @index-end
