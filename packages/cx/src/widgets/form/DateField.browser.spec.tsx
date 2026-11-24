import "../../index.scss";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { createModel } from "../../data/createAccessorModelProxy";
import { Store } from "../../data/Store";
import { DateField } from "./DateField";
import { render } from "../../util/test/render";

interface Model {
   date: string;
   refDate: string;
}

const m = createModel<Model>();

// the month and year of the days of the month shown in the open calendar
function shownMonth() {
   let day = document.querySelector<HTMLElement>(".cxb-calendar td.cxe-calendar-day:not(.cxs-outside)");
   return day ? `${day.dataset.year}-${day.dataset.month}` : null;
}

describe("DateField", () => {
   async function open(field: any, data: Record<string, any>) {
      let store = new Store({ data });
      let screen = await render(<cx>{field}</cx>, { store });
      await userEvent.click(screen.container.querySelector("input")!);
      await expect.poll(shownMonth).not.toBeNull();
      return store;
   }

   it("opens the calendar on the month of refDate if no date is selected (#549)", async () => {
      await open(<DateField value={m.date} refDate={m.refDate} />, { date: null, refDate: "2024-03-15" });
      expect(shownMonth()).toBe("2024-3");
   });

   it("opens the calendar on the month of the selected date, also with refDate", async () => {
      await open(<DateField value={m.date} refDate="2024-03-15" />, { date: "2025-07-04" });
      expect(shownMonth()).toBe("2025-7");
   });

   it("opens the calendar on the current month without refDate", async () => {
      await open(<DateField value={m.date} />, { date: null });
      let today = new Date();
      expect(shownMonth()).toBe(`${today.getFullYear()}-${today.getMonth() + 1}`);
   });
});
