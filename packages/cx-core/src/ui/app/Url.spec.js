import {Url} from './Url';
import Route from 'route-parser';

var assert = require('assert');
describe('Url', function() {
   describe('.unresolve', function () {
      it('preserves query parameters', function () {
         Url.absoluteBase = 'https://cxjs.io/docs/';
         assert.equal('~/?state=1', Url.unresolve('https://cxjs.io/docs/?state=1'))
      });

      it('doesn\'t touch unresolved urls', function () {
         assert.equal('~/test', Url.unresolve('~/test'))
      });
   });

   describe('.getBaseFromScriptSrc', () => {
      it("ignores query strings", function () {
         assert.equal(Url.getBaseFromScriptSrc('/vendor.js?qs=1', '~/vendor.js'), '/')
      });

      it("allows wildcards", function () {
         assert.equal(Url.getBaseFromScriptSrc('/vendor.123.js?qs=1', '~/vendor.*.js'), '/')
      });
   });
});

describe('Route', function() {
   it('matches query param', function () {
      let route = new Route('~/?state=:state');
      let result = route.match('~/?state=1');
      assert(result);
      assert.equal(result.state, 1);
   });

   it('matches routes with extra query params', function () {
      let route = new Route('~/?state=:state');
      let result = route.match('~/?state=1&more=2');
      assert(result);
   });

   it.skip('matches query params in any order', function () {
      let route = new Route('~/?a=:a&b=:b');
      let result = route.match('~/?b=1&a=2');
      assert(result);
   });
});
