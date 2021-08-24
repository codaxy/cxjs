import {ArrayAdapter} from './ArrayAdapter';
import {Binding} from '../../data/Binding';
import {isArray} from '../../util/isArray';
import {getAccessor} from "../../data/getAccessor";

export class TreeAdapter extends ArrayAdapter {

   init() {
      super.init();
      this.childrenAccessor = getAccessor({ bind: `${this.recordName}.${this.childrenField}` });
   }

   mapRecords(context, instance, data, parentStore, recordsAccessor) {
      let nodes = super.mapRecords(context, instance, data, parentStore, recordsAccessor);
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
               let childNodes = super.mapRecords(context, instance, data[this.childrenField], store, this.childrenAccessor);
               this.processList(context, instance, level + 1, record.key + ':', childNodes, result);
            }
            else if (this.load && !data[this.loadedField] && !data[this.loadingField]) {
               store.set(`${this.recordName}.${this.loadingField}`, true);
               let response = this.load(context, instance, data);
               Promise.resolve(response)
                  .then(children => {
                     store.set(`${this.recordName}.${this.childrenField}`, children);
                     store.set(`${this.recordName}.${this.loadedField}`, true);
                     store.set(`${this.recordName}.${this.loadingField}`, false);
                  })
                  .catch(response => {
                     store.set(`${this.recordName}.${this.loadingField}`, false);
                     if (this.onLoadError)
                        this.onLoadError(response);
                  });
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
