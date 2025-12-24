import { getSelector } from "./getSelector";
import { AggregateFunction } from "./AggregateFunction";
import { Binding } from "./Binding";

/*
 'column': {
   index: 0,
   sort: 'asc',
   group: true
   aggregate: 'count'
 }
 */

export interface GroupResult {
   key: any;
   name?: any;
   records: any[];
   indexes: number[];
   aggregates?: Record<string, any>;
}

export class Grouper {
   keys: any[];
   nameGetter?: any;
   dataGetter: any;
   aggregates?: any;
   groups: any;

   constructor(key: any, aggregates?: any, dataGetter?: any, nameGetter?: any) {
      this.keys = Object.keys(key).map((keyField) => {
         let isSimpleField = keyField.indexOf(".") === -1;
         let keySetter;
         if (isSimpleField) {
            // use simple field setter wherever possible
            keySetter = function set(result: any, value: any) {
               result[keyField] = value;
               return result;
            };
         } else {
            // for complex paths, use deep setter
            let binding = Binding.get(keyField);
            keySetter = (result: any, value: any) => binding.set(result, value);
         }
         return {
            name: keyField,
            keySetter,
            value: getSelector(key[keyField]),
         };
      });
      if (nameGetter) this.nameGetter = getSelector(nameGetter);
      this.dataGetter = dataGetter || ((x: any) => x);
      this.aggregates =
         aggregates &&
         transformValues(aggregates, (prop) => {
            if (!(prop.type in AggregateFunction)) throw new Error(`Unknown aggregate function '${prop.type}'.`);

            return {
               value: getSelector(prop.value),
               weight: getSelector(prop.weight ?? 1),
               type: prop.type,
            };
         });
      this.reset();
   }

   reset() {
      this.groups = this.initGroup(this.keys.length == 0);
   }

   initGroup(leaf: boolean) {
      if (!leaf) return {};

      return {
         records: [],
         indexes: [],
         aggregates:
            this.aggregates &&
            transformValues(this.aggregates, (prop) => {
               let f = (AggregateFunction as any)[prop.type];
               return {
                  processor: f(),
                  value: prop.value,
                  weight: prop.weight,
               };
            }),
      };
   }

   process(record: any, index: number) {
      let data = this.dataGetter(record);
      let key = this.keys.map((k) => k.value(data));
      let g = this.groups;
      for (let i = 0; i < key.length; i++) {
         let sg = g[key[i]];
         if (!sg) {
            sg = g[key[i]] = this.initGroup(i + 1 == key.length);
            if (this.nameGetter) sg.name = this.nameGetter(data);
         }
         g = sg;
      }

      g.records.push(record);
      g.indexes.push(index);

      if (g.aggregates) {
         for (let k in g.aggregates)
            g.aggregates[k].processor.process(g.aggregates[k].value(data), g.aggregates[k].weight(data));
      }
   }

   processAll(records: any[], indexes?: number[]) {
      if (indexes) {
         for (let i = 0; i < records.length; i++) this.process(records[i], indexes[i]);
      } else records.forEach((r: any, i: number) => this.process(r, i));
   }

   report(g: any, path: any[], level: number, results: GroupResult[]) {
      if (level == this.keys.length) {
         let key = {};
         this.keys.forEach((k: any, i: number) => {
            key = k.keySetter(key, path[i]);
         });
         results.push({
            key: key,
            name: g.name,
            records: g.records,
            indexes: g.indexes,
            aggregates: resolveKeyPaths(transformValues(g.aggregates, (p) => p.processor.getResult())),
         });
      } else {
         Object.keys(g).forEach((k) => this.report(g[k], [...path, k], level + 1, results));
      }
   }

   getResults(): GroupResult[] {
      let g = this.groups;
      let results: GroupResult[] = [];
      this.report(g, [], 0, results);
      return results;
   }
}

// transform object values using a function
function transformValues(o: Record<string, any>, f: (v: any, k?: string) => any): Record<string, any> {
   let res: Record<string, any> = {};
   for (let k in o) res[k] = f(o[k], k);
   return res;
}

// transform keys like 'a.b.c' into nested objects
function resolveKeyPaths(o: Record<string, any>) {
   let res: Record<string, any> = {};
   for (let k in o) {
      if (k.indexOf(".") > 0) res = Binding.get(k).set(res, o[k]);
      else res[k] = o[k];
   }
   return res;
}
