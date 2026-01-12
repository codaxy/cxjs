/** @jsxImportSource cx */
import { Button, Dropdown, TextField } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <Button
          onClick={(e, { store }) => {
            store.toggle("showDropdown");
          }}
        >
          Toggle Dropdown
        </Button>
        <Dropdown
          visible={bind("showDropdown")}
          arrow
          offset={10}
          placementOrder="down-right up-right"
          style="padding: 16px;"
        >
          This is a dropdown content.
        </Dropdown>
      </div>

      <div>
        <TextField
          value={bind("query")}
          focused={bind("showSuggestions")}
          trackFocus
          placeholder="Search..."
        />
        <Dropdown
          visible={bind("showSuggestions")}
          offset={1}
          placementOrder="down-right up-right"
          style="padding: 16px;"
          matchWidth
        >
          Search suggestions would appear here.
        </Dropdown>
      </div>
    </div>
  </cx>
);
