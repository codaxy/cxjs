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
   });
});
