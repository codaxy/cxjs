var Grouper = require("./Grouper").Grouper;
import assert from "assert";

describe("Grouper", function () {
   describe("single grouping", function () {
      it("should work", function () {
         var data = [
            { name: "John", age: 12 },
            { name: "Jane", age: 12 },
         ];

         var grouper = new Grouper({ name: { bind: "name" } });
         grouper.processAll(data);

         var results = grouper.getResults();
         // console.log(results);
         assert.equal(results.length, 2);
      });
   });

   describe("multi grouping", function () {
      it("should work", function () {
         var data = [
            { name: "John", age: 12 },
            { name: "John", age: 12 },
            { name: "John", age: 13 },
            { name: "John", age: 14 },
            { name: "Jane", age: 12 },
            { name: "Jane", age: 13 },
            { name: "Jane", age: 14 },
         ];

         var grouper = new Grouper({ name: { bind: "name" }, age: { bind: "age" } });
         grouper.processAll(data);

         var results = grouper.getResults();
         // console.log(results);
         assert.equal(results.length, 6);
         assert.equal(results[0].records.length, 2);
      });
   });
});
