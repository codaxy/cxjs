import { Button, Overlay, Widget } from "cx/widgets";

// @index
export default (
  <Button
    onClick={(e, { store }) => {
      let overlay = Widget.create(
        <Overlay
          style={{
            left: Math.random() * 50 + 25 + "%",
            top: Math.random() * 50 + 25 + "%",
            padding: "30px",
            border: "2px solid gray",
            background: "#efefef",
            textAlign: "center",
          }}
        >
          This overlay will automatically close after 3s.
        </Overlay>,
      );

      let close = overlay.open(store);
      setTimeout(close, 3000);
    }}
  >
    Add Overlay
  </Button>
);
// @index-end
