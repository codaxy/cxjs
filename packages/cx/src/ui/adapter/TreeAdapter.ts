//@ts-nocheck
import { getAccessor } from "../../data/getAccessor";
import { isArray } from "../../util/isArray";
import { ArrayAdapter } from "./ArrayAdapter";

export class TreeAdapter extends ArrayAdapter {
   init() {
      super.init();
      this.childrenAccessor = getAccessor({ bind: `${this.recordName}.${this.childrenField}` });

      if (this.restoreExpandedNodesOnLoad) {
         if (!this.keyField)
            throw new Error(
               "Stateful tree adapter requires keyField property to be specified on either Grid or data adapter.",
            );

         this.expandedState = {
            next: new Set(),
         };
      }
   }

   mapRecords(context, instance, data, parentStore, recordsAccessor) {
      let nodes = super.mapRecords(context, instance, data, parentStore, recordsAccessor);
      let result = [];

      if (this.restoreExpandedNodesOnLoad) {
         this.expandedState = {
            current: this.expandedState.next,
            next: new Set(),
         };
      }

      this.processList(context, instance, 0, "", nodes, result);

      return result;
   }

   processList(context, instance, level, parentKey, nodes, result) {
      nodes.forEach((record) => {
         record.key = parentKey + record.key;
         this.processNode(context, instance, level, result, record);
      });
   }

   processNode(context, instance, level, result, record) {
      let isHiddenRootNode = level == 0 && this.hideRootNodes;
      if (!isHiddenRootNode) result.push(record);
      let { data, store } = record;
      data.$level = this.hideRootNodes ? level - 1 : level;
      if (!data[this.leafField]) {
         if (this.restoreExpandedNodesOnLoad && data[this.expandedField] == null)
            data[this.expandedField] = this.expandedState.current.has(data[this.keyField]);

         if (data[this.expandedField] || isHiddenRootNode) {
            if (this.restoreExpandedNodesOnLoad) this.expandedState.next.add(data[this.keyField]);

            if (data[this.childrenField]) {
               let childNodes = super.mapRecords(
                  context,
                  instance,
                  data[this.childrenField],
                  store,
                  this.childrenAccessor,
               );
               this.processList(context, instance, level + 1, record.key + ":", childNodes, result);
            } else if (this.load && !data[this.loadedField] && !data[this.loadingField]) {
               store.set(`${this.recordName}.${this.loadingField}`, true);
               let response = this.load(context, instance, data);
               Promise.resolve(response)
                  .then((children) => {
                     store.set(`${this.recordName}.${this.childrenField}`, children);
                     store.set(`${this.recordName}.${this.loadedField}`, true);
                     store.set(`${this.recordName}.${this.loadingField}`, false);
                  })
                  .catch((response) => {
                     store.set(`${this.recordName}.${this.loadingField}`, false);
                     if (this.onLoadError) this.onLoadError(response);
                  });
            }
         } else data[this.expandedField] = false;
      }
   }

   sort(sorters) {
      if (this.foldersFirst) {
         if (!sorters || !isArray(sorters)) sorters = [];
         sorters = [{ field: this.leafField, direction: "ASC" }, ...sorters];
      }
      super.sort(sorters);
   }
}

TreeAdapter.prototype.childrenField = "$children";
TreeAdapter.prototype.expandedField = "$expanded";
TreeAdapter.prototype.leafField = "$leaf";
TreeAdapter.prototype.loadingField = "$loading";
TreeAdapter.prototype.loadedField = "$loaded";
TreeAdapter.prototype.foldersFirst = true;
TreeAdapter.prototype.isTreeAdapter = true;
TreeAdapter.prototype.hideRootNodes = false;
TreeAdapter.prototype.cacheByKeyField = false;
