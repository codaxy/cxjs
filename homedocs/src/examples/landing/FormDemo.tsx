/** @jsxImportSource cx */
import {
  TextField,
  NumberField,
  LookupField,
  DateField,
  TextArea,
  Button,
  MsgBox,
  enableMsgBoxAlerts,
} from "cx/widgets";
import { LabelsLeftLayout } from "cx/ui";
import { Controller } from "cx/ui";

enableMsgBoxAlerts();

class DemoController extends Controller {
  onInit() {
    this.store.set("form", {
      name: "",
      email: "",
      age: null,
      country: "us",
      message: "",
    });
  }

  onSubmit() {
    const form = this.store.get("form");
    MsgBox.alert(`Form submitted!\n\nName: ${form.name}\nEmail: ${form.email}`);
  }
}

const countries = [
  { id: "us", text: "United States" },
  { id: "uk", text: "United Kingdom" },
  { id: "de", text: "Germany" },
  { id: "fr", text: "France" },
  { id: "hr", text: "Croatia" },
];

export default () => (
  <cx>
    <div controller={DemoController} style="width: 100%;">
      <div layout={LabelsLeftLayout}>
        <TextField
          label="Name"
          value-bind="form.name"
          placeholder="Enter your name"
          style="width: 100%;"
        />
        <TextField
          label="Email"
          value-bind="form.email"
          placeholder="email@example.com"
          style="width: 100%;"
        />
        <NumberField
          label="Age"
          value-bind="form.age"
          placeholder="25"
          style="width: 100%;"
        />
        <LookupField
          label="Country"
          value-bind="form.country"
          options={countries}
          style="width: 100%;"
        />
      </div>
      <div style="margin-top: 16px; text-align: right;">
        <Button onClick="onSubmit" mod="primary">
          Submit Form
        </Button>
      </div>
    </div>
  </cx>
);
