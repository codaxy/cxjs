import {Widget} from './Widget';
import {PureContainer} from './PureContainer';
import {ArrayAdapter} from './adapter/ArrayAdapter';
import {isString} from '../util/isString';
import {Binding} from '../data/Binding';

export class Repeater extends PureContainer {

   init() {
      super.init();
      if (this.records && this.records.bind)
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
         immutable: this.immutable
      });
   }

   checkVisible(context, instance, data) {
      return instance.repeatable || super.checkVisible(context, instance, data);
   }

   declareData() {
      super.declareData({
         records: undefined,
         sorters: undefined,
         filterParams: {
            structured: true
         }
      }, ...arguments);
   }

   prepareData(context, instance) {
      super.prepareData(context, instance);

      if (!instance.repeatable) {
         let {data} = instance;
         this.dataAdapter.sort(data.sorters);

         let filter = null;
         if (this.onCreateFilter)
            filter = instance.invoke("onCreateFilter", data.filterParams, instance);
         else if (this.filter)
            filter = item => this.filter(item, data.filterParams);
         this.dataAdapter.setFilter(filter);
         instance.mappedRecords = this.dataAdapter.mapRecords(context, instance, data.records, instance.store, this.recordsBinding);
      }
   }

   explore(context, instance, data) {
      if (instance.repeatable)
         return super.explore(context, instance);

      var instances = [];
      instance.mappedRecords.forEach((record)=> {
         var subInstance = instance.getChild(context, this, record.key + ':', record.store);
         subInstance.repeatable = true;
         subInstance.record = record;
         if (this.cached && subInstance.cached && subInstance.cached.record && subInstance.cached.record.data == record.data && !subInstance.childStateDirty) {
            instances.push(subInstance);
            subInstance.shouldUpdate = false;
         } else if (subInstance.explore(context))
            instances.push(subInstance);
      });
      instance.instances = instances;
   }

   prepare(context, instance) {
      if (instance.repeatable)
         return super.prepare(context, instance);

      instance.instances.forEach(inst => {
         if (!this.cached || inst.shouldUpdate) {
            inst.prepare(context);
         }
      });
   }

   render(context, instance, key) {
      if (instance.repeatable)
         return super.render(context, instance, key);

      return instance.instances.map(ins => {
         return ins.render(context, key + ':' + ins.record.key)
      });
   }

   cleanup(context, instance) {
      if (instance.repeatable)
         return super.cleanup(context, instance);

      instance.instances.forEach(inst => {
         if (!this.cached || inst.shouldUpdate) {
            inst.cleanup(context);
            inst.cached.record = inst.record;
         }
      });
   }

   add(item) {
      if (isString(item))
         return;
      super.add(item);
   }
}

Repeater.prototype.recordName = '$record';
Repeater.prototype.indexName = '$index';
Repeater.prototype.cached = false;
Repeater.prototype.immutable = false;

Widget.alias('repeater', Repeater);