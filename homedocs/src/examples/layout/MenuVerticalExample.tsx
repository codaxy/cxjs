import { Menu, Submenu, MenuItem } from "cx/widgets";

// @index
export default () => (
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
        <MenuItem autoClose>Profile</MenuItem>
        <MenuItem autoClose>Preferences</MenuItem>
        <MenuItem autoClose>Security</MenuItem>
      </Menu>
    </Submenu>
    <hr />
    <MenuItem autoClose onClick={() => alert("Logout")}>
      Logout
    </MenuItem>
  </Menu>
);
// @index-end
