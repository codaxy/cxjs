import * as Cx from '../core';
import {RenderingContext} from "./RenderingContext";
import {View} from "../data/View";
import {Widget, VDOM} from "./Widget";

export class Instance {

   store: View;
   data: Cx.Record;
   widget: Cx.Config;
   key: number;
   id: string;

   setStore(store: View) : void;

   init(context: RenderingContext): void;

   explore(context: RenderingContext): boolean;

   prepare(context: RenderingContext): void;

   cleanup(context: RenderingContext): void;

   render(context: RenderingContext, keyPrefix?: string): void | VDOM;

   setState(state: Cx.Record): void;

   set(prop: string, value: any);

   definePropertySetter(prop: string, setter: (value: any) => void) : boolean;

   doSet(prop: string, value: any) : boolean;

   replaceState(state: Cx.Config);

   getInstanceCache() : InstanceCache;

   clearChildrenCache();

   getChild(context: RenderingContext | null, widget: Widget, keyPrefix?: string, store?: View) : Instance;

   // TODO: check return type
   prepareRenderCleanupChild(widget: Widget, store?: View, keyPrefix?: string, options?: object) : any;

   getJsxEventProps() : { [prop?: string]: any };

}

export class InstanceCache {

   constructor(parent: Instance)

   getChild(widget: Widget, store: View, keyPrefix?: string) : Instance;

   mark();

   sweep();

}