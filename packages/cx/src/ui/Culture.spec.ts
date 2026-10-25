import assert from "assert";
import { Culture, getDefaultCulture } from "./Culture";

describe("Culture", function () {
   afterEach(function () {
      Object.assign(getDefaultCulture(), {
         numberCulture: null,
         dateTimeCulture: null,
         defaultCurrency: "USD",
         timezone: null,
         dateEncoding: (date: Date) => date.toISOString(),
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

   // With culture-sensitive formatting, formatters and compiled expressions and templates
   // are cached on the culture and hold the culture objects they were built with.
   it("setters drop everything cached on the default culture", function () {
      let setters = [
         () => Culture.setCulture("de"),
         () => Culture.setNumberCulture("de-DE"),
         () => Culture.setDateTimeCulture("de-DE"),
         () => Culture.setDefaultCurrency("EUR"),
         () => Culture.setDefaultTimezone("Asia/Tokyo"),
         () => Culture.setDefaultDateEncoding((date) => date.toDateString()),
      ];
      for (let set of setters) {
         let cache = getDefaultCulture().cache;
         cache.numberCulture = cache.dateTimeCulture = {};
         cache.formatCache = cache.exprCache = cache.strTplCache = {};
         set();
         assert.deepEqual(getDefaultCulture().cache, {});
      }
   });
});
