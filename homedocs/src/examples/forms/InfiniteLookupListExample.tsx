import { createModel } from "cx/data";
import { Controller, LabelsTopLayout } from "cx/ui";
import { isString } from "cx/util";
import { LookupField } from "cx/widgets";

// @model
interface City {
  id: number;
  text: string;
}

interface Model {
  selectedCities: City[];
}

const m = createModel<Model>();

// Generate fake city database
const cityNames = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "Seattle",
  "Denver",
  "Boston",
  "El Paso",
  "Detroit",
  "Nashville",
  "Memphis",
  "Portland",
  "Baltimore",
];

const cityDb: City[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i,
  text: `${cityNames[i % cityNames.length]} ${i}`.trim(),
})).sort((a, b) => a.text.localeCompare(b.text));

// @model-end

// @controller
class PageController extends Controller<typeof m> {
  onQuery(
    q:
      | string
      | {
          query: string;
          pageSize: number;
          page: number;
        },
  ) {
    if (isString(q)) throw new Error("Paging info expected.");
    let { query, pageSize, page } = q;
    let regex = new RegExp(query, "gi");
    let filtered = cityDb.filter((x) => x.text.match(regex));
    let data = filtered.slice((page - 1) * pageSize, page * pageSize);

    return new Promise<City[]>((resolve) => {
      setTimeout(() => resolve(data), 100);
    });
  }
}
// @controller-end

// @index
export default () => (
  <LabelsTopLayout vertical controller={PageController}>
    <LookupField
      label="Select Cities"
      records={m.selectedCities}
      onQuery={(query, instance) =>
        instance.getControllerByType(PageController).onQuery(query)
      }
      multiple
      infinite
      pageSize={50}
      queryDelay={150}
      minQueryLength={2}
      placeholder="Type at least 2 characters..."
    />
  </LabelsTopLayout>
);
// @index-end
