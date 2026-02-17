import { Button, MsgBox } from "cx/widgets";

// @index
export default (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
    <Button
      onClick={() => {
        MsgBox.alert("This is a simple alert message.");
      }}
    >
      Simple Alert
    </Button>
    <Button
      onClick={(e) => {
        MsgBox.alert({
          title: "Information",
          message: "This alert has a custom title.",
          initiatingEvent: e,
        });
      }}
    >
      Alert with Title
    </Button>
    <Button
      onClick={(e) => {
        MsgBox.alert({
          title: "Custom Button",
          message: "Click the button below to close.",
          okText: "Got it!",
          initiatingEvent: e,
        });
      }}
    >
      Custom OK Text
    </Button>
  </div>
);
// @index-end
