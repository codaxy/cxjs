import { describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { Pagination } from "./Pagination";
import { render, settle, RenderResult } from "../../util/test/render";

interface Model {
   page: number;
}

const m = createModel<Model>();

// one entry per button: "<" and ">" for the previous and next page buttons,
// "*" marks the current page and "(x)" a disabled button
function describeButtons(screen: RenderResult) {
   let buttons = Array.from(screen.container.querySelectorAll(".cxe-pagination-page"));
   return buttons
      .map((button, i) => {
         let label = i == 0 ? "<" : i == buttons.length - 1 ? ">" : button.textContent;
         if (button.classList.contains("cxs-active")) label += "*";
         if (button.classList.contains("cxs-disabled")) label = `(${label})`;
         return label;
      })
      .join(" ");
}

function button(screen: RenderResult, index: number | "prev" | "next") {
   let buttons = Array.from(screen.container.querySelectorAll(".cxe-pagination-page"));
   if (index == "prev") return buttons[0];
   if (index == "next") return buttons[buttons.length - 1];
   return buttons.find((b) => b.textContent == String(index))!;
}

async function setup(page = 1, pageCount = 10) {
   let store = new Store({ data: { page } });
   let screen = await render(
      <cx>
         <Pagination page={m.page} pageCount={pageCount} />
      </cx>,
      { store },
   );
   return { store, screen };
}

describe("Pagination", () => {
   it("shows five page buttons around the current page, with previous and next buttons", async () => {
      let { store, screen } = await setup();
      assert.equal(describeButtons(screen), "(<) 1* 2 3 4 5 >");

      await settle(() => store.set(m.page, 6));
      assert.equal(describeButtons(screen), "< 4 5 6* 7 8 >");

      await settle(() => store.set(m.page, 10));
      assert.equal(describeButtons(screen), "< 6 7 8 9 10* (>)");
   });

   it("disables page buttons beyond the page count", async () => {
      let { screen } = await setup(1, 3);

      assert.equal(describeButtons(screen), "(<) 1* 2 3 (4) (5) >");
   });

   it("changes the page when a page button is clicked", async () => {
      let { store, screen } = await setup();

      await settle(() => userEvent.click(button(screen, 3)));
      assert.equal(store.get(m.page), 3);

      await settle(() => userEvent.click(button(screen, "next")));
      assert.equal(store.get(m.page), 4);

      await settle(() => userEvent.click(button(screen, "prev")));
      await settle(() => userEvent.click(button(screen, "prev")));
      assert.equal(store.get(m.page), 2);
   });

   it("does not go before the first or after the last page", async () => {
      let { store, screen } = await setup(1, 3);

      await settle(() => userEvent.click(button(screen, "prev")));
      assert.equal(store.get(m.page), 1);

      await settle(() => userEvent.click(button(screen, 4)));
      assert.equal(store.get(m.page), 1);

      await settle(() => store.set(m.page, 3));
      await settle(() => userEvent.click(button(screen, "next")));
      assert.equal(store.get(m.page), 3);
   });

   it("changes the page with the arrow keys", async () => {
      let { store, screen } = await setup(2);

      await settle(() => (screen.container.querySelector(".cxb-pagination") as HTMLElement).focus());
      await settle(() => userEvent.keyboard("{ArrowRight}{ArrowRight}"));
      assert.equal(store.get(m.page), 4);

      await settle(() => userEvent.keyboard("{ArrowLeft}"));
      assert.equal(store.get(m.page), 3);
   });
});
