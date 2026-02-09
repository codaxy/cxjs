import { Button, Toast } from "cx/widgets";

// @index
export default (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    <Button
      onClick={(e, { store }) => {
        Toast.create({
          message: "Primary notification",
          mod: "primary",
          timeout: 3000,
        }).open(
          store,
          { initiatingEvent: e }, //required for mixed theming
        );
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
        }).open(
          store,
          { initiatingEvent: e }, //required for mixed theming
        );
      }}
    >
      Success
    </Button>
    <Button
      onClick={(e, { store }) => {
        Toast.create({
          message: "Warning: Please review your input.",
          mod: "warning",
          timeout: 3000,
        }).open(
          store,
          { initiatingEvent: e }, //required for mixed theming
        );
      }}
    >
      Warning
    </Button>
    <Button
      onClick={(e, { store }) => {
        Toast.create({
          message: "Error: Something went wrong.",
          mod: "error",
          timeout: 3000,
        }).open(
          store,
          { initiatingEvent: e }, //required for mixed theming
        );
      }}
    >
      Error
    </Button>
  </div>
);
// @index-end
