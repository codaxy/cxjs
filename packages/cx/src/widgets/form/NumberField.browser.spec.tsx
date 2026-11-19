import { afterEach, beforeEach, describe, it } from "vitest";
import { userEvent } from "vitest/browser";
import assert from "assert";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { Culture } from "../../ui/Culture";
import { enableCultureSensitiveFormatting } from "../../ui/Format";
import { render, settle } from "../../util/test/render";
import { NumberField } from "./NumberField";

interface Model {
   amount: number;
}

describe("NumberField with an accounting format", () => {
   const m = createModel<Model>();

   beforeEach(() => {
      enableCultureSensitiveFormatting();
      Culture.setCulture("en-US");
   });

   afterEach(() => {
      Culture.setCulture("en");
   });

   it("shows negative values in parentheses", async () => {
      let store = new Store({ data: { amount: -1234.5 } });
      let screen = await render(<NumberField value={m.amount} format="currency;USD;2;2;a" />, { store });
      assert.equal(screen.container.querySelector("input")!.value, "($1,234.50)");
   });

   it("reads a value in parentheses as negative", async () => {
      let store = new Store();
      let screen = await render(<NumberField value={m.amount} format="currency;USD;2;2;a" />, { store });
      let input = screen.container.querySelector("input")!;
      await userEvent.fill(input, "(1234.5)");
      await settle(() => userEvent.keyboard("{Enter}"));
      assert.equal(store.get(m.amount), -1234.5);
      assert.equal(input.value, "($1,234.50)");
   });

   it("keeps a typed minus sign", async () => {
      let store = new Store();
      let screen = await render(<NumberField value={m.amount} format="n;2;2;a" />, { store });
      let input = screen.container.querySelector("input")!;
      await userEvent.fill(input, "-5");
      await settle(() => userEvent.keyboard("{Enter}"));
      assert.equal(store.get(m.amount), -5);
      assert.equal(input.value, "(5.00)");
   });

   it("keeps the sign when a negative value is edited", async () => {
      let store = new Store({ data: { amount: -5 } });
      let screen = await render(<NumberField value={m.amount} format="currency;USD;2;2;a" />, { store });
      let input = screen.container.querySelector("input")!;
      await userEvent.click(input);
      // place the cursor after the 5 in ($5.00)
      input.setSelectionRange(3, 3);
      await userEvent.keyboard("1");
      await settle(() => userEvent.keyboard("{Enter}"));
      assert.equal(store.get(m.amount), -51);
      assert.equal(input.value, "($51.00)");
   });

   it("lets a small negative value be typed in parentheses while reacting on change", async () => {
      let store = new Store();
      let screen = await render(<NumberField value={m.amount} format="currency;USD;2;2;a" reactOn="change blur" />, {
         store,
      });
      let input = screen.container.querySelector("input")!;
      await settle(() => userEvent.type(input, "(0.05"));
      assert.equal(store.get(m.amount), -0.05);
      assert.equal(input.value, "($0.05)");
   });

   it("keeps an accounting value with a parenthesized suffix", async () => {
      let store = new Store();
      let screen = await render(<NumberField value={m.amount} format="n;2;2;a:suffix; (kg)" />, { store });
      let input = screen.container.querySelector("input")!;
      await userEvent.fill(input, "-5");
      await settle(() => userEvent.keyboard("{Enter}"));
      assert.equal(store.get(m.amount), -5);
      assert.equal(input.value, "(5.00) (kg)");
      await userEvent.fill(input, "5");
      await settle(() => userEvent.keyboard("{Enter}"));
      assert.equal(store.get(m.amount), 5);
      assert.equal(input.value, "5.00 (kg)");
   });
});

describe("NumberField with parentheses in a non-accounting format", () => {
   const m = createModel<Model>();

   beforeEach(() => {
      enableCultureSensitiveFormatting();
      Culture.setCulture("en-US");
   });

   afterEach(() => {
      Culture.setCulture("en");
   });

   it("keeps positive values with a parenthesized suffix", async () => {
      let store = new Store();
      let screen = await render(<NumberField value={m.amount} format="n;2:suffix; (kg)" />, { store });
      let input = screen.container.querySelector("input")!;
      await userEvent.fill(input, "5");
      await settle(() => userEvent.keyboard("{Enter}"));
      assert.equal(store.get(m.amount), 5);
      assert.equal(input.value, "5.00 (kg)");
   });

   it("does not read parentheses as a negative sign", async () => {
      let store = new Store();
      let screen = await render(<NumberField value={m.amount} format="n;2" />, { store });
      let input = screen.container.querySelector("input")!;
      await userEvent.fill(input, "(5)");
      await settle(() => userEvent.keyboard("{Enter}"));
      assert.equal(store.get(m.amount), 5);
   });
});
