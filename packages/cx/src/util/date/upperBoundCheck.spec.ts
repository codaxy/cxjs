import assert from 'assert';
import {upperBoundCheck} from './upperBoundCheck';

describe('upperBoundCheck', () => {

   let may18th = new Date('2017-05-18'); // May 18th
   let may19th = new Date('2017-05-19'); // May 19th
   let exclusive = true; // strictly less than...

   it('returns true for May 18th <= May 19th', ()=> {
      assert.equal(upperBoundCheck(may18th, may19th), true);
   });

   it('returns true for May 19th <= May 19th', ()=> {
      assert.equal(upperBoundCheck(may19th, may19th), true);
   });

   it('returns true for May 19th <= May 19th with exclusive=`false`', ()=> {
      assert.equal(upperBoundCheck(may19th, may19th, false), true);
   });

   it('returns false for May 19th < May 19th', ()=> {
      assert.equal(upperBoundCheck(may19th, may19th, exclusive), false);
   });

   it('returns false for May 19th <= May 18th', ()=> {
      assert.equal(upperBoundCheck(may19th, may18th), false);
   });

});
