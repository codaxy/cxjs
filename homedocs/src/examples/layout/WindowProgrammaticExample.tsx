import { Store } from "cx/data";
import { Button, Widget, Window } from "cx/widgets";

// @index
export default () => (
  <Button
    onClick={() => {
      let window = Widget.create(
        <Window title="Programmatic Window" center modal>
          <div>
            <p>This window was opened programmatically.</p>
          </div>
          <div
            putInto="footer"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button dismiss>Close</Button>
          </div>
        </Window>,
      );
      window.open(new Store());
    }}
  >
    Open Programmatic Window
  </Button>
);
// @index-end
