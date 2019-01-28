"use strict";

let babel = require("@babel/core");
let plugin = require("./index");

let assert = require('assert');

function unwrap(code) {
   return code.substring(0, code.length - 1);
   //return code.substring(15, code.length-1);
}

describe('JSCX', function () {

   it("doesn't touch non-wrapped code", function () {

      let code = `<div id="123" />`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(unwrap(output), '<div id="123" />');
   });

   it('converts <cx></cx> to null', function () {

      let code = `<cx></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(unwrap(output), 'null');
   });

   it('trims whitespace within <cx>', function () {

      let Container = {};

      let code = `<cx>
         <Container />
      </cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Container
      });
   });

   it('trims whitespace if the trimWhitespace flag is set', function () {
      let Container = {};

      let code = `<cx>
         <Container>
            <Container />    
         </Container>
      </cx>`;

      let output = babel.transform(code, {
         plugins: [[plugin, { trimWhitespace: true }], '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Container,
         children: [{
            $type: Container
         }]
      });
   });

   it('preserves whitespace if ws flag is set', function () {
      let Container = {};

      let code = `<cx>
         <Container>
            <Container ws>
                Text
            </Container>    
         </Container>
      </cx>`;

      let output = babel.transform(code, {
         plugins: [[plugin, { trimWhitespace: true }], '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Container,
         children: [{
            $type: Container,
            children: ['\n                Text\n            '],
            jsxAttributes: ["ws"],
            ws: true
         }]
      })
   });

   it('converts jsx like to config', function () {

      let Component = {};

      let code = `<cx><Component></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component});
   });

   it('converts jsx attributes to config properties', function () {

      let Component = {};

      let code = `<cx><Component id="123"></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, id: "123", jsxAttributes: ['id']});
   });

   it('converts jsx literal attributes to config properties', function () {

      let code = `<cx><Component id={123}></Component></cx>`;
      let Component = {};

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, id: 123, jsxAttributes: ['id']});
   });

   it('converts jsx object attributes to config properties', function () {

      let Component = {};
      let code = `<cx><Component value={{ x: 1 }}></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, value: {x: 1}, jsxAttributes: ['value']});
   });

   it('converts jsx function attributes to config properties', function () {


      let Component = {};

      let code = `<cx><Component onClick={e=>{}}></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(typeof eval(output).onClick, "function");
   });

   it('converts jsx children into children array', function () {

      let Component = {}, Child = {}, GrandChild = {};

      let code = `<cx><Component><Child><GrandChild></GrandChild></Child></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         children: [{$type: Child, children: [{$type: GrandChild}]}]
      });
   });

   it('allows namespaces', function () {

      let ui = {Component: {}};

      let code = `<cx><ui.Component/></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: ui.Component
      });
   });

   it('converts jsx text child into text widget', function () {

      let Component = {};

      let code = `<cx><Component>Text</Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         children: ['Text']
      });
   });

   it('converts namespaced attributes into data binding objects', function () {

      let Component = {};
      let code = `<cx><Component value:bind="name" /></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {
         $type: Component,
         value: {bind: "name"},
         jsxAttributes: ['value']
      });
   });

   it('converts dash attributes into data binding objects', function () {

      let Component = {};
      let code = `<cx><Component value-bind="name" text-tpl="123" visible-expr="false" data-id="5" /></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
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

      let Component = {}, Component2 = {};
      let code = `<cx><Component /><Component2></Component2></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), [{$type: Component}, {$type: Component2}]);
   });

   it('allows expressions as children', function () {

      let Component = {};

      let code = `<cx><Component>{true}</Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, children: [true]});
   });

   it('allows props', function () {

      let Component = {};

      let code = `<cx><Component disabled /></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, disabled: true, jsxAttributes: ['disabled']});
   });

   it('allows spread', function () {

      let Component = {};
      let test = {a: 1, b: 2};

      let code = `<cx><Component {...test} /></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component, jsxSpread: [test]});
   });

   it('allows namespaced components', function () {

      let Component = {Nested: {}};

      let code = `<cx><Component.Nested /></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: Component.Nested});
   });

   it('converts lowercase tags into HtmlElement with tag prop', function () {

      let HtmlElement = {};

      let code = `<cx><div></div></cx>`;

      let output = babel.transform(code, {
         plugins: [[plugin, {autoImportHtmlElement: false}], '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.deepEqual(eval(output), {$type: HtmlElement, tag: 'div'});
   });

   it('converts jsx elements in attributes', function () {

      let Component = {};
      let Layout = {};

      let code = `<cx><Component layout={<Layout type="1" />}></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
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

      let Component = {};
      let Layout = {};

      let code = `<cx><Component layout={<cx><Layout type="1" /><Layout type="2" /></cx>}></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
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

      let Component = {};
      let Layout = {};

      let code = `<cx><Component layout={{ x: <Layout type="1" />}}></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
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

      let Component = {};
      let Column = {};

      let code = `<cx><Component columns={[ <Column type="1" /> ]}></Component></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
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

      let code = `<Cx id="123" />`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(unwrap(output), '<Cx id="123" />');
   });

   it("converts only inner content of Cx elements", function () {

      let code = `<Cx><Container class="test" /></Cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(unwrap(output).replace(/\n/g, '').replace(/\s\s/g, ' '), '<Cx items={[{ $type: Container, class: "test", jsxAttributes: ["class"]}]}></Cx>');
   });

   it("registers functional Cx components", function () {

      let code = `let x = props => <cx><Container /></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert.equal(
         unwrap(output).replace(/\n/g, '').replace(/\s\s/g, ' '),
         'import { createFunctionalComponent } from "cx/ui";let x = createFunctionalComponent(props => ({ $type: Container}))');
   });

   it("multiple functional components add only one import", function () {

      let code = `let X = props => <cx><Container /></cx>;let Y = props => <cx><Container /></cx>;`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
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

      let code = `let x = <cx><div></div></cx>`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
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

      let code = `
import { HtmlElement } from "cx/widgets";
let x = <cx><div></div></cx>
`;

      let output = babel.transform(code, {
         plugins: [plugin, '@babel/plugin-syntax-jsx']
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

   it("expands fat arrows in string based expressions if expandFatArrows is set", function () {

      let code = `<cx>
        <Repeater records-expr="{data}.filter(a=>a.enabled)" />
      </cx>`;

      let output = babel.transform(code, {
         plugins: [[plugin, { expandFatArrows: true }], '@babel/plugin-syntax-jsx']
         //presets: ['es2015']
      }).code;

      assert(output.indexOf("function (a){return a.enabled}") > 0);
   });
});
