/** @jsxImportSource cx */
import { TextField, Dropdown } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <div>
      <TextField
        value={bind("query")}
        focused={bind("showSuggestions")}
        trackFocus
        placeholder="Search..."
        style="width: 100%"
      />
      <Dropdown
        visible={bind("showSuggestions")}
        offset={1}
        style="padding: 16px;"
        matchWidth
      >
        Search suggestions appear here.
      </Dropdown>
    </div>
  </cx>
);
