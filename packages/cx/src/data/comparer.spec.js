import {sorter} from './comparer';
import assert from 'assert';

describe('comparer', function() {
   describe('sorter', function() {
      it('orders by numeric values ASC', function () {
         let records = [
            {value: 3, id: 1},
            {value: -1, id: 2},
            {value: 2, id: 3},
            {value: null, id: 4},
            {value: null, id: 5},
         ];

         let sort = sorter([{value: {bind: 'value'}, direction: 'ASC'}]);

         let sorted = sort(records);

         assert.equal(sorted[0].value, null);
         assert.equal(sorted[1].value, null);
         assert.equal(sorted[2].value, -1);
         assert.equal(sorted[3].value, 2);
         assert.equal(sorted[4].value, 3);
      });

      it('orders by numeric values DESC', function () {
         let records = [
            {value: 3, id: 1},
            {value: 1, id: 2},
            {value: -2, id: 3},
            {value: null, id: 4},
            {value: null, id: 5},
         ];

         let sort = sorter([{value: {bind: 'value'}, direction: 'DESC'}]);

         let sorted = sort(records);

         assert.equal(sorted[0].value, 3);
         assert.equal(sorted[1].value, 1);
         assert.equal(sorted[2].value, -2);
         assert.equal(sorted[3].value, null);
         assert.equal(sorted[4].value, null);
      });

      it('supports field', function () {
         let records = [
            {value: 3, id: 1},
            {value: 1, id: 2},
            {value: 2, id: 3}
         ];

         let sort = sorter([{field: 'value', direction: 'ASC'}]);
         let sorted = sort(records);
         assert.equal(sorted[0].value, 1);
         assert.equal(sorted[1].value, 2);
         assert.equal(sorted[2].value, 3);
      });
   });
});
