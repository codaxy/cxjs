import { Store } from "cx/data";
import { Button, Widget, Window } from "cx/widgets";

// @index
export default (
  <Button
    onClick={(e) => {
      let window: Window = Widget.create(
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
      window.open(new Store(), { initiatingEvent: e });
    }}
  >
    Open Programmatic Window
  </Button>
);
// @index-end
