import {Expression} from './Expression';
import assert from 'assert';

describe('Expression', function () {
   describe('#compile()', function () {
      it('returns a selector', function () {
         var e = Expression.compile('{person.name}');
         var state = {
            person: {
               name: 'Jim'
            }
         };
         assert.equal(e(state), 'Jim');
      });

      it('ignores bindings in strings', function () {
         var e = Expression.compile('"{person.name}"');
         var state = {
            person: {
               name: 'Jim'
            }
         };
         assert.equal(e(state), "{person.name}");
      });

      it('properly encodes quotes #1', function () {
         var e = Expression.compile('"\'"');
         var state = {};
         assert.equal(e(state), "'");
      });

      it('properly encodes quotes #2', function () {
         var e = Expression.compile('"\\""');
         var state = {};
         assert.equal(e(state), '"');
      });
   });

   describe('allow subexpressions', function () {
      it('in square brackets', function () {
         var e = Expression.compile('{[{person.name}]}');
         var state = {
            person: {
               name: 'Jim'
            }
         };
         assert.equal(e(state), 'Jim');
      });

      it('prefixed with % sign', function () {
         var e = Expression.compile('%{1+1}');
         assert.equal(e(), '2');
      });

      it('can be formatted', function () {
         var e = Expression.compile('{[1+1]:f;2}');
         assert.equal(e(), '2.00');
      });

      it('n level deep', function () {
         var e = Expression.compile('{[{[{[1+1]}]}]:f;2}');
         assert.equal(e(), '2.00');
      });

      it('with complex math inside', function () {
         var e = Expression.compile('%{{data}.reduce((a,b)=>a+b, 0):f;2}');
         var state = {
            data: [1, 2, 3]
         };
         assert.equal(e(state), '6.00');
      });

      it('with a conditional operator inside', function () {
         var e = Expression.compile('{[true ? "T" : "F"]}');
         assert.equal(e(), 'T');
      });
   });

   describe('are working', function () {
      it('function expressions with get', function () {
         var e = Expression.get(get => get('a') + get('b'));
         assert.equal(e({ a: 1, b: 2 }), 3);
      });

      it('are properly memoized', function () {
         let inv = 0;
         var e = Expression.get(get => { inv++; return get('a') + get('b')}).memoize();

         assert.equal(e({ a: 1, b: 1 }), 2);
         assert.equal(inv, 1);

         assert.equal(e({ a: 1, b: 1 }), 2);
         assert.equal(inv, 1);

         assert.equal(e({ a: 1, b: 2 }), 3);
         assert.equal(inv, 2);

         assert.equal(e({ a: 1, b: 2 }), 3);
         assert.equal(inv, 2);

         assert.equal(e({ a: 2, b: 2 }), 4);
         assert.equal(inv, 3);
      });

      it('formatting can be used inside bindings', function () {
         var e = Expression.get(get => get('name:prefix;Hello '));
         assert(e({ name: 'CxJS' }), 'Hello CxJS');
      });

      // it('are properly memoized with proxies', function () {
      //    let inv = 0;
      //    var e = Expression.get(d => { inv++; return d.a + d.b}).memoize();
      //
      //    assert.equal(e({ a: 1, b: 1 }), 2);
      //    assert.equal(inv, 1);
      //
      //    assert.equal(e({ a: 1, b: 1 }), 2);
      //    assert.equal(inv, 1);
      //
      //    assert.equal(e({ a: 1, b: 2 }), 3);
      //    assert.equal(inv, 2);
      //
      //    assert.equal(e({ a: 1, b: 2 }), 3);
      //    assert.equal(inv, 2);
      //
      //    assert.equal(e({ a: 2, b: 2 }), 4);
      //    assert.equal(inv, 3);
      // });
      //
      // it('are properly memoized with proxies and deep data', function () {
      //    let inv = 0;
      //    var e = Expression.get(d => { inv++; return d.v.a + d.v.b}).memoize();
      //
      //    assert.equal(e({ v: { a: 1, b: 1 }}), 2);
      //    assert.equal(inv, 1);
      //
      //    assert.equal(e({ v: { a: 1, b: 1 }}), 2);
      //    assert.equal(inv, 1);
      //
      //    assert.equal(e({ v: { a: 1, b: 2 }}), 3);
      //    assert.equal(inv, 2);
      //
      //    assert.equal(e({ v: { a: 1, b: 2 }}), 3);
      //    assert.equal(inv, 2);
      //
      //    assert.equal(e({ v: { a: 2, b: 2 }}), 4);
      //    assert.equal(inv, 3);
      // });


   });
});
