import { Link } from "./Link";
import { Store } from "../../data/Store";
import { createModel } from "../../data/createAccessorModelProxy";
import { createTestRenderer } from "../../util/test/createTestRenderer";
import assert from "assert";

const m = createModel<{ url: string }>();

function findAnchor(node: any): any {
   if (node == null || typeof node === "string") return null;
   if (Array.isArray(node)) {
      for (let child of node) {
         let result = findAnchor(child);
         if (result) return result;
      }
      return null;
   }
   if (node.type === "a") return node;
   return findAnchor(node.children);
}

async function renderLink(url: string, config: { href: string; match?: "equal" | "prefix" | "subroute"; active?: boolean }) {
   let store = new Store({ data: { url } });
   let component = await createTestRenderer(
      store,
      <cx>
         <Link href={config.href} url={m.url} match={config.match} active={config.active} text="Link" />
      </cx>,
   );
   let anchor = findAnchor(component.toJSON());
   assert.ok(anchor, "Link should render an anchor");
   return anchor;
}

async function isActive(url: string, config: { href: string; match?: "equal" | "prefix" | "subroute"; active?: boolean }) {
   let anchor = await renderLink(url, config);
   return String(anchor.props.className).indexOf("active") !== -1;
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

   describe("active override", () => {
      it("true wins over a non-matching url", async () => {
         assert.equal(await isActive("~/other", { href: "~/items", active: true }), true);
      });

      it("false wins over a matching url", async () => {
         assert.equal(await isActive("~/items", { href: "~/items", active: false }), false);
      });
   });
});
