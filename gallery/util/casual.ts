import * as helpers from 'casual/src/helpers.js';
import * as number from  'casual/src/providers/number.js';
import * as person from  'casual/src/providers/person.js';
import * as address from  'casual/src/providers/address.js';

const browsers = {
   browsers: ['Chrome', 'Firefox', 'Internet Explorer', 'Opera', 'Safari', 'Edge'],

   browser: function () {
      return this.random_element(this.browsers);
   }
}

const operatingSystems = {
   operating_systems: ['Windows', 'Mac OS', 'Ubuntu', 'Android', 'iOS', 'Edge'],

   operating_system: function () {
      return this.random_element(this.operating_systems);
   }
}

const continents = {
   continents: ['Europe', 'Asia', 'North America', 'Africa', 'South America', 'Australia', 'Antarctica'],

   continent: function () {
      return this.random_element(this.continents);
   }
}

export function build(providers) {
   var casual = helpers.extend({}, helpers);

   casual.functions = function() {
      var adapter = {};

      Object.keys(this).forEach(function(name) {
         if (name[0] === '_') {
            adapter[name.slice(1)] = casual[name];
         }
      });

      return adapter;
   };

   providers.forEach(function(provider) {
      //debugger;
      casual.register_provider(provider);
   });


   return casual;
}

export default build([number, person, address, browsers, operatingSystems, continents]);
