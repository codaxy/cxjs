import {Format} from './Format';
import assert from 'assert';

describe('Format', function () {
   describe('n,number ', function () {
      it('correctly formats numbers with min and max allowed precision', function () {
         assert.equal(Format.value(0.5, 'n;2;4'), '0.50');
         assert.equal(Format.value(0.50101, 'n;2;4'), '0.501');
         assert.equal(Format.value(0.5012, 'n;2;4'), '0.5012');
         assert.equal(Format.value(0.0, 'n;0;4'), '0');
      });

      it('correctly formats numbers fixed precision', function () {
         assert.equal(Format.value(0.5, 'number;3'), '0.500');
         assert.equal(Format.value(0.50101, 'number;3'), '0.501');
         assert.equal(Format.value(0.5016, 'number;3'), '0.502');
      });
   });

   describe('p,percentage', function () {
      it('correctly formats numbers with min and max allowed precision', function () {
         assert.equal(Format.value(0.5, 'p;2;4'), '50.00%');
         assert.equal(Format.value(0.50101, 'p;2;4'), '50.101%');
         assert.equal(Format.value(0.50123456, 'p;2;4'), '50.1235%');
         assert.equal(Format.value(0.0, 'p;0;4'), '0%');
      });

      it('correctly formats numbers fixed precision', function () {
         assert.equal(Format.value(0.5, 'percentage;3'), '50.000%');
         assert.equal(Format.value(0.50101, 'percentage;3'), '50.101%');
         assert.equal(Format.value(0.5016, 'percentage;3'), '50.160%');
      });
   });

   describe('date,time,datetime', function () {
      it('correctly formats dates', function () {
         assert.equal(Format.value(new Date(2015, 3, 1), 'd'), '4/1/2015');
      });

      it('correctly formats time', function () {
         assert.equal(Format.value(new Date(2015, 3, 1, 16, 15, 14), 't'), '16:15');
         assert.equal(Format.value(new Date(2015, 3, 1, 5, 6, 14), 'time'), '05:06');
      });

      it('correctly formats date-time', function () {
         assert.equal(Format.value(new Date(2015, 3, 1, 5, 6, 14), 'dt'), '4/1/2015 05:06');
      });
   });

   describe('ellipsis', function () {
      it('can shorten long texts', function () {
         assert.equal(Format.value('This is a very long text.', 'ellipsis;7'), 'This...');
      });

      it('can be used at the start of string', function () {
         assert.equal(Format.value('This is a very long text.', 'ellipsis;8;start'), '...text.');
      });

      it('can be used in the middle of the string', function () {
         assert.equal(Format.value('First (Middle) Last', 'ellipsis;11;middle'), 'Firs...Last');
      });
   });

   describe('null text', function () {
      it('can contain null text', function () {
         assert.equal(Format.value(null, 'n;2|N/A'), 'N/A');
      });
   });
});
