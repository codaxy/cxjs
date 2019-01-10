import {Widget} from './Widget';
import {PureContainer} from './PureContainer';
import {Container} from './Container';
import {ArrayAdapter} from './adapter/ArrayAdapter';
import {Binding, isBinding} from '../data/Binding';
import {UseParentLayout} from "./layout/UseParentLayout";

export class Repeater extends Container {

   declareData() {
      super.declareData({
         records: undefined,
         sorters: undefined,
         sortField: undefined,
         sortDirection: undefined,
         filterParams: {
            structured: true
         }
      }, ...arguments);
   }

   init() {

      if (isBinding(this.records))
         this.recordsBinding = Binding.get(this.records.bind);

      if (this.recordAlias)
         this.recordName = this.recordAlias;

      if (this.indexAlias)
         this.indexName = this.indexAlias;

      this.dataAdapter = ArrayAdapter.create({
         ...this.dataAdapter,
         recordName: this.recordName,
         indexName: this.indexName,
         keyField: this.keyField,
         immutable: this.immutable,
         sealed: this.sealed
      });

      this.item = PureContainer.create({
         children: this.items || this.children,
         layout: UseParentLayout
      });

      delete this.children;
      delete this.items;

      super.init();
   }

   initInstance(context, instance) {
      this.dataAdapter.initInstance(context, instance);
   }

   prepareData(context, instance) {
      let {data} = instance;
      if (data.sortField)
         data.sorters = [{
            field: data.sortField,
            direction: data.sortDirection || "ASC"
         }];
      this.dataAdapter.sort(data.sorters);
      let filter = null;
      if (this.onCreateFilter)
         filter = instance.invoke("onCreateFilter", data.filterParams, instance);
      else if (this.filter)
         filter = item => this.filter(item, data.filterParams);
      this.dataAdapter.setFilter(filter);
      instance.mappedRecords = this.dataAdapter.mapRecords(context, instance, data.records, instance.store, this.recordsBinding);
      super.prepareData(context, instance);
   }

   explore(context, instance, data) {
      var instances = [];
      instance.mappedRecords.forEach((record) => {
         var subInstance = instance.getChild(context, this.item, record.key, record.store);
         let changed = subInstance.cache('recordData', record.data) || subInstance.cache('key', record.key);
         subInstance.record = record;
         if (this.cached && !changed && subInstance.visible && !subInstance.childStateDirty) {
            instances.push(subInstance);
            subInstance.shouldUpdate = false;
         } else if (subInstance.scheduleExploreIfVisible(context))
            instances.push(subInstance);
      });
      instance.children = instances;
   }
}

Repeater.prototype.recordName = '$record';
Repeater.prototype.indexName = '$index';
Repeater.prototype.cached = false;
Repeater.prototype.immutable = false;
Repeater.prototype.sealed = false;
Repeater.prototype.isPureContainer = true;

Widget.alias('repeater', Repeater);