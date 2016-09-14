import {ArrayAdapter} from './ArrayAdapter';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {Grouper} from '../../data/Grouper';


export class GroupAdapter extends ArrayAdapter {

   getRecords(context, instance, records, parentStore) {
      var result = super.getRecords(context, instance, records, parentStore);

      if (this.groupings) {
         var groupedResults = [];
         this.processLevel([], result, groupedResults, parentStore);
         result = groupedResults;
      }

      return result;
   }

   processLevel(keys, records, result, parentStore) {

      var level = keys.length;
      var inverseLevel = this.groupings.length - level;

      if (inverseLevel == 0) {
         result.push(...records);
         return;
      }

      var grouping = this.groupings[level];
      var {grouper} = grouping;
      grouper.reset();
      grouper.processAll(records);
      var results = grouper.getResults();

      results.forEach(gr => {

         keys.push(gr.key);

         var group = {
            type: 'group-header',
            key: keys.map(key=>Object.keys(key).map(k=>key[k]).join(':')).join('|'),
            data: gr.records[0],
            group: {...gr.key, ...gr.aggregates, $name: gr.name, $level: inverseLevel},
            grouping,
            store: parentStore,
            level: inverseLevel
         };

         result.push(group);

         this.processLevel(keys, gr.records, result, parentStore);


         result.push({
            ...group,
            type: 'group-footer'
         });

         keys.pop();
      });
   }

   groupBy(groupings) {
      if (!groupings)
         this.groupings = null;
      else if (Array.isArray(groupings)) {
         this.groupings = groupings;
         this.groupings.forEach(g=> {
            g.grouper = new Grouper(g.key, {...this.aggregates, ...g.aggregates}, r=>r.store.getData(), g.text);
         });
      } else
         throw new Error('Invalid grouping provided.');
      this.updateSorter();
   }

   updateSorter() {
      var sorters = [];
      if (this.groupings)
         this.groupings.forEach(g=> {
            for (var k in g.key)
               sorters.push({ value: g.key[k] });
         });
      if (this.sorters)
         sorters.push(...this.sorters);
      this.buildSorter(sorters);
   }

   sort(sorters) {
      this.sorters = sorters;
      this.updateSorter();
   }
}
