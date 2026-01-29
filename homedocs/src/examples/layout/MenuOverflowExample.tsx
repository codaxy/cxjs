import { Menu, Submenu, MenuItem, MenuSpacer } from "cx/widgets";

// @index
export default (
  <Menu horizontal overflow style={{ width: "300px" }}>
    <Submenu>
      File
      <Menu putInto="dropdown">
        <MenuItem autoClose>New</MenuItem>
        <MenuItem autoClose>Open</MenuItem>
        <MenuItem autoClose>Save</MenuItem>
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
      </Menu>
    </Submenu>
    <MenuSpacer />
    <Submenu>
      Help
      <Menu putInto="dropdown">
        <MenuItem autoClose>Documentation</MenuItem>
        <MenuItem autoClose>About</MenuItem>
      </Menu>
    </Submenu>
  </Menu>
);
// @index-end
