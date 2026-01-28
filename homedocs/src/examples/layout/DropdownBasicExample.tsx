import { createModel } from "cx/data";
import { Button, Dropdown, Menu, MenuItem } from "cx/widgets";

// @model
interface PageModel {
  showDropdown: boolean;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <div>
    <Button
      onClick={(e, { store }) => {
        store.toggle(m.showDropdown);
      }}
    >
      Toggle Dropdown
    </Button>
    <Dropdown visible={m.showDropdown} arrow offset={4} placementOrder="down-right up-right" class="p-2">
      <Menu>
        <MenuItem>Option 1</MenuItem>
        <MenuItem>Option 2</MenuItem>
        <MenuItem>Option 3</MenuItem>
      </Menu>
    </Dropdown>
  </div>
);
// @index-end
