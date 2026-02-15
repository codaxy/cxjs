import { Menu, Submenu, MenuItem } from "cx/widgets";

// @index
export default (
  <Menu style={{ width: "200px" }}>
    <MenuItem autoClose onClick={() => alert("Dashboard")}>
      Dashboard
    </MenuItem>
    <MenuItem autoClose onClick={() => alert("Reports")}>
      Reports
    </MenuItem>
    <Submenu arrow>
      Settings
      <Menu putInto="dropdown">
        <MenuItem autoClose onClick={() => {}}>Profile</MenuItem>
        <MenuItem autoClose onClick={() => {}}>Preferences</MenuItem>
        <MenuItem autoClose onClick={() => {}}>Security</MenuItem>
      </Menu>
    </Submenu>
    <hr />
    <MenuItem autoClose onClick={() => alert("Logout")}>
      Logout
    </MenuItem>
  </Menu>
);
// @index-end
