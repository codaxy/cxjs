require('./babel');
import {Url} from '../src/app/Url';
import Route from 'route-parser';

var assert = require('assert');
describe('Url', function() {
   it('unresolve', function () {
      it('preserves query parameters', function () {
         Url.absoluteBase = 'http://cx.codaxy.com/docs/';
         assert.equal('~/?state=1', Url.unresolve('http://cx.codaxy.com/docs/?state=1'))
      });

      it('doesn\'t touch unresolved urls', function () {
         assert.equal('~/test', Url.unresolve('~/test'))
      });
   });
});

describe('Route', function() {
   it('matches query param', function () {
      var route = new Route('~/?state=:state');
      var result = route.match('~/?state=1');
      assert(result);
      assert.equal(result.state, 1);
   });

   it('matches routes with extra query params', function () {
      var route = new Route('~/?state=:state');
      var result = route.match('~/?state=1&more=2');
      assert(result);
   });

   it.skip('matches query params in any order', function () {
      var route = new Route('~/?a=:a&b=:b');
      var result = route.match('~/?b=1&a=2');
      assert(result);
   });
});
