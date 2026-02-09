import { Menu, Submenu, MenuItem, MenuSpacer } from "cx/widgets";

// @index
export default (
  <Menu horizontal overflow style={{ width: "300px" }}>
    <Submenu>
      File
      <Menu putInto="dropdown">
        <MenuItem autoClose onClick={() => {}}>New</MenuItem>
        <MenuItem autoClose onClick={() => {}}>Open</MenuItem>
        <MenuItem autoClose onClick={() => {}}>Save</MenuItem>
      </Menu>
    </Submenu>
    <Submenu>
      Edit
      <Menu putInto="dropdown">
        <MenuItem autoClose onClick={() => {}}>Cut</MenuItem>
        <MenuItem autoClose onClick={() => {}}>Copy</MenuItem>
        <MenuItem autoClose onClick={() => {}}>Paste</MenuItem>
      </Menu>
    </Submenu>
    <Submenu>
      View
      <Menu putInto="dropdown">
        <MenuItem autoClose onClick={() => {}}>Zoom In</MenuItem>
        <MenuItem autoClose onClick={() => {}}>Zoom Out</MenuItem>
      </Menu>
    </Submenu>
    <MenuSpacer />
    <Submenu>
      Help
      <Menu putInto="dropdown">
        <MenuItem autoClose onClick={() => {}}>Documentation</MenuItem>
        <MenuItem autoClose onClick={() => {}}>About</MenuItem>
      </Menu>
    </Submenu>
  </Menu>
);
// @index-end
