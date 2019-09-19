import { Controller, PropertySelection } from "cx/ui";
import { HtmlElement, List, Text } from "cx/widgets";

class PageController extends Controller {
  init() {
    super.init();

    this.store.init(
      "$page.records",
      Array.from({ length: 4 }).map((x, i) => ({ text: `${i + 1}` }))
    );
  }
}

export default  <cx>
  <div controller={PageController}>
    <List
      records:bind="$page.records"
      selection={PropertySelection}
      emptyText="Nothing results found."
      unhidableCursor
      mod="bordered"
      >
      <div>
        <h4>Header <Text expr="{$index}+1" /></h4>
      </div>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
    </List>
  </div>
</cx>