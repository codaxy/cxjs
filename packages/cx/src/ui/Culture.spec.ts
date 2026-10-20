import assert from "assert";
import { Culture, getDefaultCulture } from "./Culture";

describe("Culture", function () {
   afterEach(function () {
      Object.assign(getDefaultCulture(), {
         numberCulture: null,
         dateTimeCulture: null,
         defaultCurrency: "USD",
         timezone: null,
      });
      Culture.setCulture("en");
   });

   it("setDefaultTimezone applies to an already used date-time culture", function () {
      let date = new Date("2026-04-24T12:00:00Z");
      Culture.setDefaultTimezone("UTC");
      assert.equal(Culture.getDateTimeCulture().getFormatter("HHmmN").format(date), "12:00");
      Culture.setDefaultTimezone("Asia/Tokyo");
      assert.equal(Culture.getDateTimeCulture().getFormatter("HHmmN").format(date), "21:00");
   });

   // With culture-sensitive formatting enabled, built formatters are cached on the culture's cache.
   it("setters drop formatters cached on the default culture", function () {
      let setters = [
         () => Culture.setNumberCulture("de-DE"),
         () => Culture.setDateTimeCulture("de-DE"),
         () => Culture.setDefaultCurrency("EUR"),
         () => Culture.setDefaultTimezone("Asia/Tokyo"),
      ];
      for (let set of setters) {
         getDefaultCulture().cache.formatCache = { n: () => "stale" };
         set();
         assert.equal(getDefaultCulture().cache.formatCache, undefined);
      }
   });
});
