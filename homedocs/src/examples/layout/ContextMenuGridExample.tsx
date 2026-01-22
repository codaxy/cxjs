import { createModel } from "cx/data";
import { openContextMenu, Menu, MenuItem, Grid } from "cx/widgets";

// @model
interface PageModel {
  records: { id: number; name: string; value: number }[];
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <Grid
    records={[
      { id: 1, name: "Item 1", value: 100 },
      { id: 2, name: "Item 2", value: 200 },
      { id: 3, name: "Item 3", value: 300 },
    ]}
    columns={[
      {
        header: "Name",
        field: "name",
      },
      {
        header: "Value",
        field: "value",
        align: "right",
      },
    ]}
    onColumnContextMenu={(e, instance) => {
      openContextMenu(
        e,
        <Menu>
          <MenuItem autoClose>Sort A-Z</MenuItem>
          <MenuItem autoClose>Sort Z-A</MenuItem>
          <hr />
          <MenuItem autoClose>Hide Column</MenuItem>
        </Menu>,
        instance,
      );
    }}
    onRowContextMenu={(e, instance) => {
      openContextMenu(
        e,
        <Menu>
          <MenuItem autoClose>Edit</MenuItem>
          <MenuItem autoClose>Duplicate</MenuItem>
          <hr />
          <MenuItem autoClose>Delete</MenuItem>
        </Menu>,
        instance,
      );
    }}
  />
);
// @index-end
