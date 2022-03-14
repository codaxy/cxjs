import { Button, HtmlElement, TextArea } from "cx/widgets";
import { LabelsLeftLayout } from "cx/ui";

export default (
  <cx>
    <div layout={LabelsLeftLayout}>
      <TextArea label="Standard" value:bind="$page.text" rows={5} autoFocus />
      <Button
        text="Submit"
        onClick={(e, { store }) => {
          alert(store.get("$page.text"));
        }}
      />
    </div>
  </cx>
);
