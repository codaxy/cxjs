import {ArrayAdapter} from './ArrayAdapter';
import {Binding} from '../../data/Binding';

export class TreeAdapter extends ArrayAdapter {

   mapRecords(context, instance, data, parentStore, recordsBinding) {
      var nodes = super.mapRecords(context, instance, data, parentStore, recordsBinding);
      var result = [];
      this.processList(context, instance, 0, '', nodes, result);
      return result;
   }

   processList(context, instance, level, parentKey, nodes, result) {
      var nonLeafs = [], leafs = [];
      nodes.forEach(record => {
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
               var childNodes = super.mapRecords(context, instance, data[this.childrenField], store, Binding.get(`${this.recordName}.${this.childrenField}`));
               this.processList(context, instance, level + 1, record.key + ':', childNodes, result);
            }
            else if (!data[this.loadedField]) {
               if (this.load) {
                  store.set(`${this.recordName}.${this.loadedField}`, true);
                  var response = this.load(context, instance, data);
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
}

TreeAdapter.prototype.childrenField = '$children';
TreeAdapter.prototype.expandedField = '$expanded';
TreeAdapter.prototype.leafField = '$leaf';
TreeAdapter.prototype.loadingField = '$loading';
TreeAdapter.prototype.loadedField = '$loaded';