import {Component} from '../../util/Component';

export class Selection extends Component {
   
   isSelected(store, record, index) {
      return this.bind && store.get(this.bind) === record;
   }

   getIsSelectedDelegate(store) {
      return (record, index) => this.isSelected(store, record, index);
   }
   
   select(store, record, index, options) {
      this.selectMultiple(store, [record], [index], options)
   }

   selectMultiple(store, records, indexes, options) {
      //abstract
   }

   declareData() {
      var declaration = {
         $selection: { structured: true }
      };

      return Object.assign(declaration, ...arguments);
   }

   configureWidget(widget) {

      if (this.record || this.index) {
         widget.$selection = Object.assign(widget.$selection || {}, {
            record: this.record,
            index: this.index
         })
      }

      return this.declareData();
   }

   selectInstance(instance) {
      var {store, data} = instance;
      if (!data.$selection)
         throw new Error('Selection model not properly configured. Using the selectInstance method without specified record and index bindings.');
      return this.select(store, data.$selection.record, data.$selection.index);
   }

   isInstanceSelected(instance) {
      var {store, data} = instance;
      return data.$selection && this.isSelected(store, data.$selection.record, data.$selection.index);
   }
}

Selection.prototype.toggle = false;

Selection.namespace = 'ui.selection.';

class SimpleSelection extends Selection {

   isSelected(store, record, index) {
      return this.getIsSelectedDelegate(store)(record, index);
   }

   getIsSelectedDelegate(store) {
      var selection = this.bind && store.get(this.bind);
      return (record, index) => record === selection;
   }

   selectMultiple(store, records, index) {
      if (this.bind)
         store.set(this.bind, records[0]);
   }
}

class DummySelection extends Selection {
   isSelected(store, record, index) {
      return false;
   }

   selectMultiple() {
      //dummy
   }

   selectInstance() {
      //dummy
   }
}

DummySelection.prototype.isDummy = true;

Selection.factory = (name) => {
   if (typeof name == 'object')
      return new SimpleSelection(name);

   return new DummySelection();
};

