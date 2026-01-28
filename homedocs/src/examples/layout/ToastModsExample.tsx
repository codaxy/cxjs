import { Button, Toast } from "cx/widgets";

// @index
export default (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    <Button
      onClick={(e) => {
        Toast.create({
          message: "Primary notification",
          mod: "primary",
          timeout: 3000,
        }).open();
      }}
    >
      Primary
    </Button>
    <Button
      onClick={(e, { store }) => {
        Toast.create({
          message: "Success! Operation completed.",
          mod: "success",
          timeout: 3000,
        }).open();
      }}
    >
      Success
    </Button>
    <Button
      onClick={(e) => {
        Toast.create({
          message: "Warning: Please review your input.",
          mod: "warning",
          timeout: 3000,
        }).open();
      }}
    >
      Warning
    </Button>
    <Button
      onClick={(e) => {
        Toast.create({
          message: "Error: Something went wrong.",
          mod: "error",
          timeout: 3000,
        }).open();
      }}
    >
      Error
    </Button>
  </div>
);
// @index-end
