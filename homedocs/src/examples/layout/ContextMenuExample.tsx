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
          <MenuItem autoClose onClick={() => {}}>Cut</MenuItem>
          <MenuItem autoClose onClick={() => {}}>Copy</MenuItem>
          <MenuItem autoClose onClick={() => {}}>Paste</MenuItem>
          <MenuItem autoClose onClick={() => {}} disabled>Delete</MenuItem>
        </Menu>,
        instance
      );
    }}
  >
    Right-click here to open context menu
  </div>
);
// @index-end
