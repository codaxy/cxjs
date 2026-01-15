import { Menu, Submenu, MenuItem } from "cx/widgets";

// @index
export default () => (
  <Menu horizontal>
    <Submenu>
      File
      <Menu putInto="dropdown">
        <MenuItem autoClose onClick={() => alert("New")}>
          New
        </MenuItem>
        <MenuItem autoClose onClick={() => alert("Open")}>
          Open
        </MenuItem>
        <MenuItem autoClose onClick={() => alert("Save")}>
          Save
        </MenuItem>
        <hr />
        <MenuItem disabled>Export (disabled)</MenuItem>
      </Menu>
    </Submenu>
    <Submenu>
      Edit
      <Menu putInto="dropdown">
        <MenuItem autoClose>Cut</MenuItem>
        <MenuItem autoClose>Copy</MenuItem>
        <MenuItem autoClose>Paste</MenuItem>
      </Menu>
    </Submenu>
    <Submenu>
      View
      <Menu putInto="dropdown">
        <MenuItem autoClose>Zoom In</MenuItem>
        <MenuItem autoClose>Zoom Out</MenuItem>
        <Submenu arrow>
          More Options
          <Menu putInto="dropdown">
            <MenuItem autoClose>Option 1</MenuItem>
            <MenuItem autoClose>Option 2</MenuItem>
          </Menu>
        </Submenu>
      </Menu>
    </Submenu>
  </Menu>
);
// @index-end
