import {ArrayAdapter} from './ArrayAdapter';
import {Binding} from '../../data/Binding';

export class TreeAdapter extends ArrayAdapter {

   getRecords(context, instance, data, parentStore) {
      var nodes = this.mapRecords(context, instance, data, parentStore, this.recordsBinding);
      var result = [];
      this.processList(context, instance, 0, '', nodes, result);
      return result;
   }

   processList(context, instance, level, parentKey, nodes, result) {
      var nonLeafs = [], leafs = [];
      nodes.forEach(record=> {
         record.key = parentKey + record.key;
         this.processNode(context, instance, level, record.data.$leaf ? leafs : nonLeafs, record)
      });
      result.push(...nonLeafs, ...leafs);
   }

   processNode(context, instance, level, result, record) {
      result.push(record);
      var {data, store} = record;
      data.$level = level;
      if (!data[this.leafField]) {
         if (data[this.expandedField]) {
            if (data[this.childrenField]) {
               var childNodes = this.mapRecords(context, instance, data[this.childrenField], store, Binding.get(`${this.recordName}.${this.childrenField}`));
               this.processList(context, instance, level + 1, record.key + ':', childNodes, result);
            }
            else if (!data[this.loadedField]) {
               if (this.load) {
                  store.set('$record.$loading', true);
                  var response = this.load(context, instance, data);
                  Promise.resolve(response)
                     .then(children=> {
                        store.set('$record.$children', children);
                        store.set('$record.$loaded', true);
                        store.set('$record.$loading', false);
                     })
                     .catch(response => {
                        if (this.onLoadError)
                           this.onLoadError(response);
                     })
               }
            }
         } else
            data.$expanded = false;
      }
   }
}

TreeAdapter.prototype.childrenField = '$children';
TreeAdapter.prototype.expandedField = '$expanded';
TreeAdapter.prototype.leafField = '$leaf';
TreeAdapter.prototype.loadingField = '$loading';
TreeAdapter.prototype.loadedField = '$loaded';