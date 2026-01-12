import { createAccessorModelProxy } from "cx/data";
import { LabelsLeftLayout } from "cx/ui";
import { Button, Window, TextField, TextArea, DateField } from "cx/widgets";

// @model
interface PageModel {
  contact: {
    visible: boolean;
    name: string;
    email: string;
    message: string;
    date: string;
  };
}

const m = createAccessorModelProxy<PageModel>();
// @model-end

// @index
export default () => (
  <div>
    <Button
      onClick={(e, { store }) => {
        store.set(m.contact.visible, true);
      }}
    >
      Open Window
    </Button>
    <Window
      title="Contact"
      visible={m.contact.visible}
      center
      style={{ width: "500px" }}
      modal
      draggable
      closeOnEscape
    >
      <div style={{ padding: "20px" }}>
        <LabelsLeftLayout>
          <TextField value={m.contact.name} label="Name" />
          <TextField value={m.contact.email} label="Email" />
          <TextArea value={m.contact.message} label="Message" rows={5} />
          <DateField value={m.contact.date} label="Date" />
        </LabelsLeftLayout>
      </div>
      <div
        putInto="footer"
        style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
      >
        <Button mod="primary">Submit</Button>
        <Button dismiss>Cancel</Button>
      </div>
    </Window>
  </div>
);
// @index-end
