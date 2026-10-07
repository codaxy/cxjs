import { StructuredSelector } from "./StructuredSelector";
import assert from "assert";
import { createAccessorModelProxy } from "./createAccessorModelProxy";

describe("StructuredSelector", function () {
   describe("#create()", function () {
      it("constants", function () {
         var x = {};
         var s = new StructuredSelector({
            props: {
               a: undefined,
               b: undefined,
            },
            values: {
               a: 1,
               b: 2,
            },
         }).create();

         assert.deepEqual(s(x), { a: 1, b: 2 });
      });

      it("bindings", function () {
         var x = { a: 1, b: 2 };
         var s = new StructuredSelector({
            props: {
               a: undefined,
               b: undefined,
            },
            values: {
               a: { bind: "b" },
               b: { bind: "a" },
            },
         }).create();

         assert.deepEqual(s(x), { a: 2, b: 1 });
      });

      it("templates", function () {
         var x = { a: 1, b: 2 };
         var s = new StructuredSelector({
            props: {
               a: undefined,
               b: undefined,
            },
            values: {
               a: { tpl: "b{a}" },
               b: { tpl: "a{b}" },
            },
         }).create();

         assert.deepEqual(s(x), { a: "b1", b: "a2" });
      });

      it("structured", function () {
         var x = { a: 1, b: 2 };
         var s = new StructuredSelector({
            props: {
               a: {
                  structured: true,
               },
               b: undefined,
            },
            values: {
               a: {
                  x: { expr: "{a} == 1" },
                  y: { expr: "{b} == 1" },
               },
               b: { tpl: "a{b}" },
            },
         }).create();

         assert.deepEqual(s(x), { a: { x: true, y: false }, b: "a2" });
      });
   });

   it("structures do not change if data doesn't change", function () {
      var x = { a: 1, b: 2 };
      var s = new StructuredSelector({
         props: {
            a: {
               structured: true,
            },
         },
         values: {
            a: {
               x: { expr: "{a} == 1" },
               y: { expr: "{b} == 1" },
            },
            b: { tpl: "a{b}" },
         },
      }).create();

      let r1 = s(x);
      let r2 = s(x);

      assert.equal(r1, r2);
   });

   it("accessor model proxy works", function () {
      var x = { a: { b: 2 } };
      var m = createAccessorModelProxy<typeof x>();
      var s = new StructuredSelector({
         props: {
            b: undefined,
         },
         values: {
            b: m.a.b,
         },
      }).create();
      assert.deepEqual(s(x), { b: 2 });
   });

   describe("default values", function () {
      let m = createAccessorModelProxy<{ a: boolean; b: boolean; c: boolean; s: { color: string } }>();

      it("are collected for binding objects and accessor chains alike", function () {
         let s = new StructuredSelector({
            props: { x: true, y: true, z: undefined },
            values: { x: { bind: "a" }, y: m.b, z: m.c },
         });
         assert.deepEqual(s.config.defaultValues, { a: true, b: true });
      });

      it("prefer an explicit binding defaultValue over the declared default", function () {
         let s = new StructuredSelector({
            props: { x: true },
            values: { x: { bind: "a", defaultValue: false } },
         });
         assert.deepEqual(s.config.defaultValues, { a: false });
      });

      it("are not collected for accessor chains nested in structured props", function () {
         let s = new StructuredSelector({
            props: { style: { structured: true } },
            values: { style: { color: m.s.color } },
         });
         assert.deepEqual(s.config.defaultValues, {});
      });
   });
});
