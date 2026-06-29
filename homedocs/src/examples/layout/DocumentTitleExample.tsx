import { createModel } from "cx/data";
import { DocumentTitle, TextField } from "cx/widgets";
import { bind, LabelsLeftLayout } from "cx/ui";

// @model
interface PageModel {
  pageTitle: string;
}

const m = createModel<PageModel>();
// @model-end

// @index
export default (
  <LabelsLeftLayout>
    <DocumentTitle value={bind(m.pageTitle, "CxJS Documentation")} action="replace" />
    <TextField
      value={bind(m.pageTitle, "CxJS Documentation")}
      label="Tab title:"
      placeholder="Type something..."
    />
    <p className="text-sm text-gray-500">
      Look at your browser tab — its title updates as you type.
    </p>
  </LabelsLeftLayout>
);
// @index-end
