import { createModel } from "cx/data";
import { Menu, MenuItem } from "cx/widgets";
import "../../icons/lucide";

// @model
interface PageModel {
  darkMode: boolean;
  notifications: boolean;
  autoSave: boolean;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default () => (
  <Menu icons style={{ width: "200px" }}>
    <MenuItem icon="search" autoClose onClick={() => alert("Search")}>
      Search
    </MenuItem>
    <MenuItem icon="folder" autoClose onClick={() => alert("Browse")}>
      Browse Files
    </MenuItem>
    <hr />
    <MenuItem checked={m.darkMode}>Dark Mode</MenuItem>
    <MenuItem checked={m.notifications}>Notifications</MenuItem>
    <MenuItem checked={m.autoSave}>Auto Save</MenuItem>
  </Menu>
);
// @index-end
