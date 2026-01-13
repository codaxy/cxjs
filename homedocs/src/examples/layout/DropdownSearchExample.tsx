import { createAccessorModelProxy } from "cx/data";
import { TextField, Dropdown } from "cx/widgets";

// @model
interface PageModel {
  query: string;
  showSuggestions: boolean;
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <div>
    <TextField
      value={m.query}
      focused={m.showSuggestions}
      trackFocus
      icon="search"
      placeholder="Search..."
      inputAttrs={{ autoComplete: "off" }}
    />
    <Dropdown
      visible={m.showSuggestions}
      offset={1}
      placementOrder="down-right up-right"
      style="padding: 20px;"
      matchWidth
    >
      Display search results here.
    </Dropdown>
  </div>
);
// @index-end
