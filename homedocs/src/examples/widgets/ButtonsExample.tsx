/** @jsxImportSource cx */
import { Button, MsgBox, enableMsgBoxAlerts } from "cx/widgets";

// Enable MsgBox alerts
enableMsgBoxAlerts();

export default () => (
  <cx>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <Button onClick={() => MsgBox.alert("Regular")}>Regular</Button>
      <Button pressed>Pressed</Button>
      <Button disabled>Disabled</Button>
      <Button mod="primary" onClick={() => MsgBox.alert("Primary")}>
        Primary
      </Button>
      <Button
        mod="danger"
        confirm="Are you sure?"
        onClick={() => MsgBox.alert("Danger")}
      >
        Danger
      </Button>
      <Button mod="hollow">Hollow</Button>
    </div>
  </cx>
);
