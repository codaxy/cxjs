import {ArrayAdapter} from './ArrayAdapter';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {Grouper} from '../../data/Grouper';
import {isArray} from '../../util/isArray';
import {isDefined} from "../../util/isDefined";
import {getComparer} from "../../data";

export class GroupAdapter extends ArrayAdapter {

   init() {
      super.init();

      if (this.groupings)
         this.groupBy(this.groupings);
   }

   getRecords(context, instance, records, parentStore) {
      let result = super.getRecords(context, instance, records, parentStore);

      if (this.groupings) {
         let groupedResults = [];
         this.processLevel([], result, groupedResults, parentStore);
         result = groupedResults;
      }

      return result;
   }

   processLevel(keys, records, result, parentStore) {

      let level = keys.length;
      let inverseLevel = this.groupings.length - level;

      if (inverseLevel == 0) {
         for (let i = 0; i < records.length; i++) {
            records[i].store.setStore(parentStore);
            result.push(records[i]);
         }
         return;
      }

      let grouping = this.groupings[level];
      let {grouper} = grouping;
      grouper.reset();
      grouper.processAll(records);
      let results = grouper.getResults();
      if (grouping.comparer)
         results.sort(grouping.comparer);

      results.forEach(gr => {

         keys.push(gr.key);

         let $group = {...gr.key, ...gr.aggregates, $name: gr.name, $level: inverseLevel};
         let groupStore = new ReadOnlyDataView({
            store: parentStore,
            data: {
               [this.groupName]: $group
            },
            immutable: this.immutable
         });

         let group = {
            key: keys.map(key => Object.keys(key).map(k => key[k]).join(':')).join('|'),
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
            let groupSorters = [];
            let key = {};
            for (let name in g.key) {
               if (!g.key[name] || !isDefined(g.key[name].direction) || !isDefined(g.key[name].value))
                  g.key[name] = {value: g.key[name], direction: 'ASC'};
               key[name] = g.key[name].value;
               groupSorters.push({
                  field: name,
                  direction: g.key[name].direction
               });
            }
            g.grouper = new Grouper(key, {...this.aggregates, ...g.aggregates}, r => r.store.getData(), g.text);
            g.comparer = null;
            if (groupSorters.length > 0)
               g.comparer = getComparer(groupSorters, x => x.key)
         });
      } else
         throw new Error('Invalid grouping provided.');
   }
}

GroupAdapter.prototype.groupName = '$group';