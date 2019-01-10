import {ArrayAdapter} from './ArrayAdapter';
import {Binding} from '../../data/Binding';
import {isArray} from '../../util/isArray';

export class TreeAdapter extends ArrayAdapter {

   mapRecords(context, instance, data, parentStore, recordsBinding) {
      let nodes = super.mapRecords(context, instance, data, parentStore, recordsBinding);
      let result = [];
      this.processList(context, instance, 0, '', nodes, result);
      return result;
   }

   processList(context, instance, level, parentKey, nodes, result) {
      let nonLeafs = [], leafs = [];
      nodes.forEach(record => {
         record.key = parentKey + record.key;
         this.processNode(context, instance, level, record.data.$leaf ? leafs : nonLeafs, record)
      });
      result.push(...nonLeafs, ...leafs);
   }

   processNode(context, instance, level, result, record) {
      result.push(record);
      let {data, store} = record;
      data.$level = level;
      if (!data[this.leafField]) {
         if (data[this.expandedField]) {
            if (data[this.childrenField]) {
               let childNodes = super.mapRecords(context, instance, data[this.childrenField], store, Binding.get(`${this.recordName}.${this.childrenField}`));
               this.processList(context, instance, level + 1, record.key + ':', childNodes, result);
            }
            else if (!data[this.loadedField]) {
               if (this.load) {
                  store.set(`${this.recordName}.${this.loadingField}`, true);
                  let response = this.load(context, instance, data);
                  Promise.resolve(response)
                     .then(children => {
                        store.set(`${this.recordName}.${this.childrenField}`, children);
                        store.set(`${this.recordName}.${this.loadedField}`, true);
                        store.set(`${this.recordName}.${this.loadingField}`, false);
                     })
                     .catch(response => {
                        if (this.onLoadError)
                           this.onLoadError(response);
                     })
               }
            }
         } else
            data[this.expandedField] = false;
      }
   }

   sort(sorters) {
      if (this.foldersFirst) {
            if (!sorters || !isArray(sorters))
                  sorters = [];

            sorters = [
                  {field: this.leafField, direction: "ASC"},
                  ...sorters
            ];
      }

      super.sort(sorters);
   }
}

TreeAdapter.prototype.childrenField = '$children';
TreeAdapter.prototype.expandedField = '$expanded';
TreeAdapter.prototype.leafField = '$leaf';
TreeAdapter.prototype.loadingField = '$loading';
TreeAdapter.prototype.loadedField = '$loaded';
TreeAdapter.prototype.foldersFirst = true;
TreeAdapter.prototype.isTreeAdapter = true;
