/** @jsxImportSource cx */
import { Button, Dropdown } from "cx/widgets";
import { bind } from "cx/ui";

export default () => (
  <cx>
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
        style="padding: 16px;"
      >
        This is dropdown content.
      </Dropdown>
    </div>
  </cx>
);
