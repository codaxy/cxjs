/** @jsxImportSource cx */
import { List, Text } from "cx/widgets";
import { Controller, PropertySelection } from "cx/ui";
import { $page, $record } from "../stores.js";

class PageController extends Controller {
  onInit() {
    this.store.set(
      "records",
      Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        text: `Item ${i + 1}`,
        description: `Description for item ${i + 1}`,
      })),
    );
  }
}

export default () => (
  <cx>
    <div controller={PageController}>
      <List
        records={$page.records}
        selection={{ type: PropertySelection, bind: $page.selection }}
        style="width: 250px;"
        mod="bordered"
      >
        <div>
          <strong text={$record.text} />
        </div>
        <div text={$record.description} style="font-size: 12px; color: #666;" />
      </List>
    </div>
  </cx>
);
