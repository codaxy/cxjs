var Grouper = require('./Grouper').Grouper;
import assert from 'assert';

describe('Grouper', function() {
   describe('grouping', function () {
      it('should work', function () {
         var data = [{
            key: 1,
            value: 1
         }, {
            key: 2,
            value: 2
         }];

         var grouper = new Grouper({ key: {bind:'key'}});
         grouper.processAll(data);

         var results = grouper.getResults();
         //console.log(results);
         assert.equal(results.length, 2);
      });
   });
});