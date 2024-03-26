let Grouper = require("./Grouper").Grouper;
import assert from "assert";

describe("Grouper", function () {
   describe("single grouping", function () {
      it("should work", function () {
         let data = [
            { name: "John", age: 12 },
            { name: "Jane", age: 12 },
         ];

         let grouper = new Grouper({ name: { bind: "name" } });
         grouper.processAll(data);

         let results = grouper.getResults();
         // console.log(results);
         assert.equal(results.length, 2);
      });

      it("keys can have nested properties", function () {
         let data = [
            { name: "John", age: 12 },
            { name: "Jane", age: 12 },
         ];

         let grouper = new Grouper({ "person.name": { bind: "name" } });
         grouper.processAll(data);

         let results = grouper.getResults();
         assert.equal(results.length, 2);
         assert.equal(results[0].key.person?.name, "John");
         assert.equal(results[1].key.person?.name, "Jane");
      });
   });

   describe("multi grouping", function () {
      it("should work", function () {
         let data = [
            { name: "John", age: 12 },
            { name: "John", age: 12 },
            { name: "John", age: 13 },
            { name: "John", age: 14 },
            { name: "Jane", age: 12 },
            { name: "Jane", age: 13 },
            { name: "Jane", age: 14 },
         ];

         let grouper = new Grouper({ name: { bind: "name" }, age: { bind: "age" } });
         grouper.processAll(data);

         let results = grouper.getResults();
         // console.log(results);
         assert.equal(results.length, 6);
         assert.equal(results[0].records.length, 2);
      });
   });
});
