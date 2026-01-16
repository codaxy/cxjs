import { createModel } from "cx/data";
import { Controller, FirstVisibleChildLayout, equal, tpl } from "cx/ui";
import { Button } from "cx/widgets";

// @model
interface PageModel {
  fetch: {
    status: "LOADING" | "SUCCESS" | "ERROR";
    result: number;
  };
}

const m = createModel<PageModel>();
// @model-end

// @controller
class FetchController extends Controller<PageModel> {
  fetch() {
    this.store.set(m.fetch.status, "LOADING");
    setTimeout(() => {
      if (Math.random() > 0.5) {
        this.store.set(m.fetch.status, "SUCCESS");
        this.store.set(m.fetch.result, Math.random() * 100);
      } else {
        this.store.set(m.fetch.status, "ERROR");
      }
    }, 1000);
  }
}
// @controller-end

// @index
export default () => (
  <div controller={FetchController}>
    <FirstVisibleChildLayout>
      <div visible={equal(m.fetch.status, "LOADING")} style={{ color: "gray" }}>
        Loading...
      </div>
      <div visible={equal(m.fetch.status, "ERROR")} style={{ color: "red" }}>
        Error occurred while loading data.
      </div>
      <div
        visible={equal(m.fetch.status, "SUCCESS")}
        style={{ color: "green" }}
        text={tpl(m.fetch.result, "Success! Result: {0:n;2}")}
      />
      <div style={{ color: "gray" }}>Data not loaded yet.</div>
    </FirstVisibleChildLayout>
    <Button onClick="fetch" disabled={equal(m.fetch.status, "LOADING")}>
      Fetch
    </Button>
  </div>
);
// @index-end
