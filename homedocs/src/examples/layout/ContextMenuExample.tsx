import { openContextMenu, Menu, MenuItem } from "cx/widgets";

// @index
export default (
  <div
    style={{
      padding: "40px",
      border: "1px dashed #ccc",
      textAlign: "center",
      cursor: "context-menu",
    }}
    onContextMenu={(e, instance) => {
      openContextMenu(
        e,
        <Menu>
          <MenuItem autoClose>Cut</MenuItem>
          <MenuItem autoClose>Copy</MenuItem>
          <MenuItem autoClose>Paste</MenuItem>
          <MenuItem autoClose disabled>Delete</MenuItem>
        </Menu>,
        instance
      );
    }}
  >
    Right-click here to open context menu
  </div>
);
// @index-end
