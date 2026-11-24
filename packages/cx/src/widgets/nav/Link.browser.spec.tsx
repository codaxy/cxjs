import { afterEach, beforeEach, describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import { Link } from "./Link";
import { Store } from "../../data/Store";
import { History } from "../../ui/app/History";
import { createModel } from "../../data/createAccessorModelProxy";
import { render, settle } from "../../util/test/render";
import assert from "assert";

const m = createModel<{ url: string }>();

async function renderLink(url: string, config: { href: string; match?: "equal" | "prefix" | "subroute"; active?: boolean }) {
   let store = new Store({ data: { url } });
   let screen = await render(
      <cx>
         <Link href={config.href} url={m.url} match={config.match} active={config.active} text="Link" />
      </cx>,
      { store },
   );
   let anchor = screen.container.querySelector("a");
   assert.ok(anchor, "Link should render an anchor");
   return anchor;
}

async function isActive(url: string, config: { href: string; match?: "equal" | "prefix" | "subroute"; active?: boolean }) {
   let anchor = await renderLink(url, config);
   return anchor.className.indexOf("active") !== -1;
}

describe("Link", () => {
   describe("match=equal (default)", () => {
      it("is active on the exact url", async () => {
         assert.equal(await isActive("~/items", { href: "~/items" }), true);
      });

      it("compares the full url — a query string breaks equality", async () => {
         assert.equal(await isActive("~/items?filter=x", { href: "~/items" }), false);
      });

      it("is inactive on a different url", async () => {
         assert.equal(await isActive("~/other", { href: "~/items" }), false);
      });

      it("is inactive on a subroute", async () => {
         assert.equal(await isActive("~/items/1", { href: "~/items" }), false);
      });
   });

   describe("match=subroute", () => {
      it("is active on the exact url", async () => {
         assert.equal(await isActive("~/items", { href: "~/items", match: "subroute" }), true);
      });

      it("is active on a subroute", async () => {
         assert.equal(await isActive("~/items/1", { href: "~/items", match: "subroute" }), true);
      });

      it("treats ? as a boundary — active when the url carries a query", async () => {
         assert.equal(await isActive("~/items?filter=x", { href: "~/items", match: "subroute" }), true);
      });

      it("is active on a subroute with a query", async () => {
         assert.equal(await isActive("~/items/1?tab=log", { href: "~/items", match: "subroute" }), true);
      });

      it("is inactive on a sibling that shares a string prefix", async () => {
         assert.equal(await isActive("~/items-archive", { href: "~/items", match: "subroute" }), false);
      });

      it("is inactive on a sibling with a query string", async () => {
         assert.equal(await isActive("~/items-archive?filter=x", { href: "~/items", match: "subroute" }), false);
      });

      it("is inactive on a different url", async () => {
         assert.equal(await isActive("~/other/items", { href: "~/items", match: "subroute" }), false);
      });
   });

   describe("match=prefix", () => {
      it("is active on a string-prefix sibling", async () => {
         assert.equal(await isActive("~/items-archive", { href: "~/items", match: "prefix" }), true);
      });

      it("is active when the url carries a query", async () => {
         assert.equal(await isActive("~/items?filter=x", { href: "~/items", match: "prefix" }), true);
      });
   });

   describe("href with a query string (query-routed navs)", () => {
      it("matches only the identical query", async () => {
         assert.equal(await isActive("~/page?tab=1", { href: "~/page?tab=1" }), true);
      });

      it("is inactive on a different query", async () => {
         assert.equal(await isActive("~/page?tab=2", { href: "~/page?tab=1" }), false);
      });

      it("is inactive without a query", async () => {
         assert.equal(await isActive("~/page", { href: "~/page?tab=1" }), false);
      });
   });

   describe("click on a local href", () => {
      let pushState = History.pushState;
      let pushed: string[];
      let browserNavigates: boolean | undefined;

      // runs after the handlers of the app; records whether the browser would follow the link, then stops it
      function stopNavigation(e: MouseEvent) {
         browserNavigates = !e.defaultPrevented;
         e.preventDefault();
      }

      beforeEach(() => {
         pushed = [];
         browserNavigates = undefined;
         History.pushState = (state, title, url) => {
            pushed.push(url);
            return true;
         };
         window.addEventListener("click", stopNavigation);
      });

      afterEach(() => {
         History.pushState = pushState;
         window.removeEventListener("click", stopNavigation);
      });

      async function click(target?: string) {
         let screen = await render(
            <cx>
               <Link href="~/reports" target={target} text="Reports" />
            </cx>,
         );
         await settle(() => userEvent.click(screen.getByText("Reports")));
      }

      it("navigates in the app without a target", async () => {
         await click();
         assert.deepEqual(pushed, ["/reports"]);
         assert.equal(browserNavigates, false);
      });

      it("navigates in the app with target=_self", async () => {
         await click("_self");
         assert.deepEqual(pushed, ["/reports"]);
         assert.equal(browserNavigates, false);
      });

      it("leaves target=_blank to the browser", async () => {
         await click("_blank");
         assert.deepEqual(pushed, []);
         assert.equal(browserNavigates, true);
      });

      it("leaves a named target to the browser", async () => {
         await click("report");
         assert.deepEqual(pushed, []);
         assert.equal(browserNavigates, true);
      });
   });

   describe("active override", () => {
      it("true wins over a non-matching url", async () => {
         assert.equal(await isActive("~/other", { href: "~/items", active: true }), true);
      });

      it("false wins over a matching url", async () => {
         assert.equal(await isActive("~/items", { href: "~/items", active: false }), false);
      });
   });
});
