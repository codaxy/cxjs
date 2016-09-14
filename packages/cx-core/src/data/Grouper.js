import {getSelector} from './getSelector';
import {AggregateFunction} from './AggregateFunction';

/*
 'column': {
   index: 0,
   sort: 'asc',
   group: true
   aggregate: 'count'
 }
 */

function transform(o, f) {
   var res = {};
   for (var k in o)
      res[k] = f(o[k], k);
   return res;
}

export class Grouper {
   constructor(key, aggregates, dataGetter, nameGetter) {
      this.keys = Object.keys(key).map(k => {
         return {
            name: k,
            value: getSelector(key[k])
         }
      });
      if (nameGetter)
         this.nameGetter = getSelector(nameGetter);
      this.dataGetter = dataGetter || (x=>x);
      this.aggregates = aggregates && transform(aggregates, prop => {
            if (!AggregateFunction[prop.type])
               throw new Error(`Unknown aggregate function '${prop.type}'.`);

            return {
               value: getSelector(prop.value),
               weight: getSelector(prop.weight || 1),
               type: prop.type
            }
         });
      this.reset();
   }

   reset() {
      this.groups = this.initGroup(this.keys.length == 0)
   }

   initGroup(leaf) {
      if (!leaf)
         return {};

      return {
         records: [],
         indexes: [],
         aggregates: this.aggregates && transform(this.aggregates, prop => {
            var f = AggregateFunction[prop.type];
            return {
               processor: f(),
               value: prop.value,
               weight: prop.weight
            }
         })
      }
   }

   process(record, index) {
      var data = this.dataGetter(record);
      var key = this.keys.map(k=>k.value(data));
      var g = this.groups;
      for (var i = 0; i < key.length; i++) {
         var sg = g[key[i]];
         if (!sg) {
            sg = g[key[i]] = this.initGroup(i + 1 == key.length);
            if (this.nameGetter)
               sg.name = this.nameGetter(data);
         }
         g = sg;
      }

      g.records.push(record);
      g.indexes.push(index);

      if (g.aggregates) {
         for (var k in g.aggregates)
            g.aggregates[k].processor.process(g.aggregates[k].value(data), g.aggregates[k].weight(data));
      }
   }

   processAll(records, indexes) {
      if (indexes) {
         for (var i = 0; i < records.length; i++)
            this.process(records[i], indexes[i]);
      }
      else
         records.forEach((r, i)=>this.process(r, i));
   }

   report(g, path, level, results) {
      if (level == this.keys.length) {
         var key = {};
         this.keys.forEach((k, i) => key[k.name] = path[i]);
         results.push({
            key: key,
            name: g.name,
            records: g.records,
            indexes: g.indexes,
            aggregates: transform(g.aggregates, p=>p.processor.getResult())
         })
      } else {
         Object.keys(g).forEach(k=>this.report(g[k], [...path, k], level + 1, results));
      }
   }

   getResults() {
      var g = this.groups;
      var results = [];
      this.report(g, [], 0, results);
      return results;
   }
}
