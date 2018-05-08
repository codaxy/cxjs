"use strict";

var babel  = require("babel-core");
var plugin = require("./index");

var assert = require('assert');

function unwrap(code) {
   return code.substring(0, code.length - 1);
   //return code.substring(15, code.length-1);
}

describe('JSCX', function() {

   it("doesn't touch non-wrapped code", function () {

      var code = `<div id="123" />`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(unwrap(output), '<div id="123" />');
   });

   it('converts <cx></cx> to null', function () {

      var code = `<cx></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(unwrap(output), 'null');
   });

   it('allows whitespice within <cx>', function () {

      var Container = {};

      var code = `<cx>
         <Container />
      </cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Container});
   });

   it('converts jsx like to config', function () {

      var Component = {};

      var code = `<cx><Component></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component});
   });

   it('converts jsx attributes to config properties', function () {
      
      var Component = {};

      var code = `<cx><Component id="123"></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, id: "123", jsxAttributes: ['id']});
   });

   it('converts jsx literal attributes to config properties', function () {

      var code = `<cx><Component id={123}></Component></cx>`;
      var Component = {};

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, id: 123, jsxAttributes: ['id']});
   });

   it('converts jsx object attributes to config properties', function () {

      var Component = {};
      var code = `<cx><Component value={{ x: 1 }}></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, value: {x: 1}, jsxAttributes: ['value']});
   });

   it('converts jsx function attributes to config properties', function () {

      
      var Component = {};

      var code = `<cx><Component onClick={e=>{}}></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx', 'transform-es2015-arrow-functions']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(typeof eval(output).onClick, "function");
   });

   it('converts jsx children into children array', function () {
      
      var Component = {}, Child = {}, GrandChild = {};

      var code = `<cx><Component><Child><GrandChild></GrandChild></Child></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         children: [{$type: Child, children: [{$type: GrandChild}]}]
      });
   });

   it('allows namespaces', function () {
      
      var ui = {Component: {}};

      var code = `<cx><ui.Component/></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: ui.Component
      });
   });

   it('converts jsx text child into text widget', function () {
      
      var Component = {};

      var code = `<cx><Component>Text</Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         children: ['Text']
      });
   });

   it('converts namespaced attributes into data binding objects', function () {

      var Component = {};
      var code = `<cx><Component value:bind="name" /></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         value: {bind: "name"},
         jsxAttributes: ['value']
      });
   });

   it('converts dash attributes into data binding objects', function () {

      var Component = {};
      var code = `<cx><Component value-bind="name" text-tpl="123" visible-expr="false" data-id="5" /></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         value: {bind: "name"},
         text: {tpl: '123'},
         visible: {expr: 'false'},
         "data-id": "5",
         jsxAttributes: ['value', 'text', 'visible', 'data-id']
      });
   });

   it('multiple root elements are converted to a config array', function () {

      var Component = {}, Component2 = {};
      var code = `<cx><Component /><Component2></Component2></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), [{$type: Component}, {$type: Component2}]);
   });

   it('allows expressions as children', function () {

      var Component = {};

      var code = `<cx><Component>{true}</Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, children: [true]});
   });

   it('allows props', function () {

      var Component = {};

      var code = `<cx><Component disabled /></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, disabled: true, jsxAttributes: ['disabled']});
   });

   it('allows spread', function () {

      var Component = {};
      var test = {a: 1, b: 2};

      var code = `<cx><Component {...test} /></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, jsxSpread: [test]});
   });

   it('allows namespaced components', function () {

      var Component = { Nested: {} };

      var code = `<cx><Component.Nested /></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component.Nested});
   });

   it('converts lowercase tags into HtmlElement with tag prop', function () {

      var HtmlElement = { };

      var code = `<cx><div></div></cx>`;

      var output = babel.transform(code, {
         plugins: [[plugin, { autoImportHtmlElement: false }], 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: HtmlElement, tag: 'div'});
   });

   it('converts jsx elements in attributes', function () {

      var Component = {};
      var Layout = {};

      var code = `<cx><Component layout={<Layout type="1" />}></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         jsxAttributes: ['layout'],
         layout: {
            $type: Layout,
            jsxAttributes: ['type'],
            type: "1"
         }
      });
   });

   it('converts jsx element arrays in attributes', function () {

      var Component = {};
      var Layout = {};

      var code = `<cx><Component layout={<cx><Layout type="1" /><Layout type="2" /></cx>}></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         jsxAttributes: ['layout'],
         layout: [{
            $type: Layout,
            jsxAttributes: ['type'],
            type: "1"
         }, {
            $type: Layout,
            jsxAttributes: ['type'],
            type: "2"
         }]
      });
   });

   it('converts jsx elements in structured attributes', function () {

      var Component = {};
      var Layout = {};

      var code = `<cx><Component layout={{ x: <Layout type="1" />}}></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         jsxAttributes: ['layout'],
         layout: {
            x: {
               $type: Layout,
               jsxAttributes: ['type'],
               type: "1"
            }
         }
      });
   });

   it('converts jsx elements within arrays', function () {

      var Component = {};
      var Column = {};

      var code = `<cx><Component columns={[ <Column type="1" /> ]}></Component></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         jsxAttributes: ['columns'],
         columns: [{
            $type: Column,
            jsxAttributes: ['type'],
            type: "1"
         }]
      });
   });

   it("doesn't touch empty Cx element", function () {

      var code = `<Cx id="123" />`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(unwrap(output), '<Cx id="123" />');
   });

   it("converts only inner content of Cx elements", function () {

      var code = `<Cx><Container class="test" /></Cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(unwrap(output).replace(/\n/g, '').replace(/\s\s/g, ' '), '<Cx items={[{ $type: Container, class: "test", jsxAttributes: ["class"]}]}></Cx>');
   });

   it("registers functional Cx components", function () {

      var code = `let x = props => <cx><Container /></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(
         unwrap(output).replace(/\n/g, '').replace(/\s\s/g, ' '),
         'import { createFunctionalComponent } from "cx/ui";let x = createFunctionalComponent(props => ({ $type: Container}))');
   });

   it("multiple functional components add only one import", function () {

      var code = `let X = props => <cx><Container /></cx>;let Y = props => <cx><Container /></cx>;`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(
         unwrap(output).replace(/\n/g, '').replace(/\s\s/g, ' '),
         [
            'import { createFunctionalComponent } from "cx/ui";',
            'let X = createFunctionalComponent(props => ({ $type: Container}));',
            'let Y = createFunctionalComponent(props => ({ $type: Container}))'
         ].join('')
      );
   });

   it("import for HtmlElement is automatically added", function () {

      var code = `let x = <cx><div></div></cx>`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(
         unwrap(output).replace(/\n/g, '').replace(/\s\s/g, ' '),
         [
            'import { HtmlElement } from "cx/widgets";',
            'let x = { $type: HtmlElement, tag: "div"}',
         ].join('')
      );
   });

   it("does not auto import HtmlElement if it's already there", function () {

      var code = `
import { HtmlElement } from "cx/widgets";
let x = <cx><div></div></cx>
`;

      var output = babel.transform(code, {
         plugins: [plugin, 'syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(
         unwrap(output).replace(/\n/g, '').replace(/\s\s/g, ' '),
         [
            'import { HtmlElement } from "cx/widgets";',
            'let x = { $type: HtmlElement, tag: "div"}',
         ].join('')
      );
   });
});
