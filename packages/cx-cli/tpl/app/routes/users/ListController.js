import { Controller } from "cx/ui";
import { debounce } from "cx/util";
import { queryUsers } from "./api";

let lastQueryId = 0;

export default class extends Controller {
    onInit() {
        this.addTrigger("search", ["search"], debounce(::this.load, 200));
        this.load();
    }

    load() {
        let q = this.store.get("search");
        this.store.set("status", "loading");
        let queryId = ++lastQueryId;
        queryUsers(q)
            .then(data => {
                //only the last query matters
                if (queryId === lastQueryId) {
                    this.store.set("results", data);
                    this.store.set("status", "ok");
                }
            })
            .catch(() => {
                if (queryId === lastQueryId) {
                    this.store.set("status", "error");
                }
            });
    }
}
