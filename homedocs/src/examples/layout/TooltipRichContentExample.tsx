import { createModel } from "cx/data";
import { Controller } from "cx/ui";
import { enableTooltips, Link, Grid } from "cx/widgets";

enableTooltips();

// @model
interface PageModel {
  records: Array<{ id: number; name: string; phone: string }>;
}

const m = createModel<PageModel>();
// @model-end

// @controller
class PageController extends Controller<PageModel> {
  onInit() {
    this.store.set(m.records, [
      { id: 1, name: "John Doe", phone: "555-1234" },
      { id: 2, name: "Jane Smith", phone: "555-5678" },
      { id: 3, name: "Bob Wilson", phone: "555-9012" },
    ]);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={PageController} className="flex flex-col items-start gap-4">
    <div
      className="cursor-help"
      tooltip={{
        mouseTrap: true,
        children: (
          <div className="max-w-sm">
            <p>
              Tooltips can contain any content. For example, we can add{" "}
              <Link href="https://cxjs.io" target="_blank">
                a link to the CxJS website
              </Link>{" "}
              or <strong>make some text bold</strong>.
            </p>
            <p className="mt-2">
              Any component can be used here too, however, tooltips work best
              with text and images.
            </p>
            <p className="mt-2">
              Note that tooltip elements are appended to the <code>body</code>{" "}
              element, hence only global style rules apply.
            </p>
            <p className="mt-2">
              To support link clicks inside a tooltip, set{" "}
              <code>mouseTrap: true</code> so it doesn't disappear.
            </p>
          </div>
        ),
      }}
    >
      Rich content
    </div>

    <div
      className="cursor-help"
      tooltip={{
        mouseTrap: true,
        children: (
          <Grid
            records={m.records}
            columns={[
              { field: "name", header: "Name", sortable: true },
              { field: "phone", header: "Phone", sortable: true },
            ]}
          />
        ),
      }}
    >
      Component inside (Grid)
    </div>
  </div>
);
// @index-end
