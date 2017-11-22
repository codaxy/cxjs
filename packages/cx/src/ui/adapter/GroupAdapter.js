import {ArrayAdapter} from './ArrayAdapter';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {Grouper} from '../../data/Grouper';
import {isArray} from '../../util/isArray';
import {isDefined} from "../../util/isDefined";

export class GroupAdapter extends ArrayAdapter {

   init() {
      super.init();

      if (this.groupings)
         this.groupBy(this.groupings);
   }

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
         for (var i = 0; i < records.length; i++) {
            records[i].store.setStore(parentStore);
            result.push(records[i]);
         }
         return;
      }

      var grouping = this.groupings[level];
      var {grouper} = grouping;
      grouper.reset();
      grouper.processAll(records);
      var results = grouper.getResults();

      results.forEach(gr => {

         keys.push(gr.key);

         var $group = {...gr.key, ...gr.aggregates, $name: gr.name, $level: inverseLevel};
         var groupStore = new ReadOnlyDataView({
            store: parentStore,
            data: {
               [this.groupName]: $group
            },
            immutable: this.immutable
         });

         var group = {
            key: keys.map(key=>Object.keys(key).map(k=>key[k]).join(':')).join('|'),
            data: gr.records[0],
            group: $group,
            grouping,
            store: groupStore,
            level: inverseLevel
         };

         if (grouping.includeHeader !== false)
            result.push({
               ...group,
               type: 'group-header',
               key: 'header:' + group.key
            });

         this.processLevel(keys, gr.records, result, groupStore);

         if (grouping.includeFooter !== false)
            result.push({
               ...group,
               type: 'group-footer',
               key: 'footer:' + group.key
            });


         keys.pop();
      });
   }

   groupBy(groupings) {
      if (!groupings)
         this.groupings = null;
      else if (isArray(groupings)) {
         this.groupings = groupings;
         this.groupings.forEach(g => {
            let key = {};
            for (let name in g.key) {
               if (!g.key[name] || !isDefined(g.key[name].direction) || !isDefined(g.key[name].value))
                  g.key[name] = {value: g.key[name], direction: 'ASC'};
               key[name] = g.key[name].value;
            }
            g.grouper = new Grouper(key, {...this.aggregates, ...g.aggregates}, r => r.store.getData(), g.text);
         });
      } else
         throw new Error('Invalid grouping provided.');
      this.updateSorter();
   }

   updateSorter() {
      var sorters = [];
      if (this.groupings)
         this.groupings.forEach(g => {
            for (var k in g.key)
               sorters.push({value: g.key[k].value, direction: g.key[k].direction});
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

GroupAdapter.prototype.groupName = '$group';