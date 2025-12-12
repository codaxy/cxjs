import { Component } from "../../util/Component";
import { View } from "../../data/View";
import { AccessorChain } from "../../data/createAccessorModelProxy";
import { Prop } from "../Prop";

export interface SelectionOptions {
   toggle?: boolean;
   add?: boolean;
}

export interface SelectionConfig {
   /** Binding path for selection state. */
   bind?: string | AccessorChain<any>;

   /** Record binding. */
   record?: Prop<any>;

   /** Index binding. */
   index?: Prop<number>;

   toggle?: boolean;

   /** Set to `true` to allow multiple selection. */
   multiple?: boolean;
}

export class Selection extends Component {
   declare bind?: string;
   declare record?: any;
   declare index?: any;
   declare toggle: boolean;
   declare isDummy: boolean;
   declare multiple: boolean;

   constructor(config?: SelectionConfig) {
      super(config);
   }

   isSelected(store: View, record: any, index: any): boolean {
      return !!this.bind && store.get(this.bind) === record;
   }

   getIsSelectedDelegate(store: View): (record: any, index: any) => boolean {
      return (record, index) => this.isSelected(store, record, index);
   }

   select(store: View, record: any, index: any, options?: SelectionOptions): any {
      this.selectMultiple(store, [record], [index], options);
   }

   selectMultiple(store: View, records: any[], indexes: any[], options?: SelectionOptions): any {
      //abstract
   }

   declareData(...args: any[]): any {
      var declaration = {
         $selection: { structured: true },
      };

      return Object.assign(declaration, ...args);
   }

   configureWidget(widget: any): any {
      if (this.record || this.index) {
         widget.$selection = Object.assign(widget.$selection || {}, {
            record: this.record,
            index: this.index,
         });
      }

      return this.declareData();
   }

   selectInstance(instance: any, options?: SelectionOptions): any {
      var { store, data } = instance;
      if (!data.$selection)
         throw new Error(
            "Selection model not properly configured. Using the selectInstance method without specified record and index bindings.",
         );
      return this.select(store, data.$selection.record, data.$selection.index, options);
   }

   isInstanceSelected(instance: any): boolean {
      var { store, data } = instance;
      return data.$selection && this.isSelected(store, data.$selection.record, data.$selection.index);
   }
}

Selection.prototype.toggle = false;

Selection.namespace = "ui.selection.";

export class SimpleSelection extends Selection {
   isSelected(store: View, record: any, index: any): boolean {
      return this.getIsSelectedDelegate(store)(record, index);
   }

   getIsSelectedDelegate(store: View): (record: any, index: any) => boolean {
      var selection = this.bind && store.get(this.bind);
      return (record, index) => record === selection;
   }

   selectMultiple(store: View, records: any[], index: any[]): void {
      if (this.bind) store.set(this.bind, records[0]);
   }
}

class DummySelection extends Selection {
   isSelected(store: View, record: any, index: any): boolean {
      return false;
   }

   selectMultiple(): void {
      //dummy
   }

   selectInstance(): void {
      //dummy
   }
}

DummySelection.prototype.isDummy = true;

Selection.factory = (name: any): Selection => {
   if (typeof name == "object") return new SimpleSelection(name);

   return new DummySelection();
};
