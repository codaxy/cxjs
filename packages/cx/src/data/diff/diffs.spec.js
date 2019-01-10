import assert from 'assert';
import {diffArrays} from './diffArrays';


describe('diffArrays', function() {
   it('should detect new elements', function () {
      var a = [];
      var b = [{k: 1}, {k: 2}]
      var d = diffArrays(a, b);
      assert.deepEqual(d, {
         added: [{k: 1}, {k: 2}],
         removed: [],
         unchanged: [],
         changed: []
      });
   });

   it('should detect removed elements', function () {
      var a = [];
      var b = [{k: 1}, {k: 2}]
      var d = diffArrays(b, a);
      assert.deepEqual(d, {
         removed: [{k: 1}, {k: 2}],
         added: [],
         unchanged: [],
         changed: []
      });
   });

   it('should detect changed elements', function () {
      var a = [{k: 1, v: 2}];
      var b = [{k: 1}, {k: 2}]
      var d = diffArrays(a, b, x=>x.k);
      assert.deepEqual(d, {
         added: [{k: 2}],
         removed: [],
         unchanged: [],
         changed: [{
            after: {
               k: 1
            },
            before: {
               k: 1, v: 2
            }
         }]
      });
   });
});

