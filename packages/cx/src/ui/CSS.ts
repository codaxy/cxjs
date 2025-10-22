import { CSSHelper } from "./CSSHelper";
import { parseStyle } from "../util/parseStyle";
import { isArray } from "../util/isArray";

function push(list: any[] | undefined, item: any): any[] {
   if (!item) return list || [];
   if (!list) list = [];
   list.push(item);
   return list;
}

function pushMore(list: any[] | undefined, itemArray: any[]): any[] {
   if (!itemArray || itemArray.length == 0) return list || [];
   if (!list) list = [];
   list.push.apply(list, itemArray);
   return list;
}

function pushMap(list: any[] | undefined, itemArray: any[] | undefined, mapF: (item: any) => any): any[] | undefined {
   return itemArray ? pushMore(list, itemArray.map(mapF)) : list;
}

function join(list: any[] | undefined): string | null {
   return list ? list.join(" ") : null;
}

export class CSS {
   public static classPrefix: string;

   static resolve(...args: any[]): any[] {
      let list: any[] | undefined = undefined,
         type: string,
         arg: any,
         i: number,
         key: string;

      for (i = 0; i < args.length; i++) {
         arg = args[i];
         if (arg) {
            type = typeof arg;
            if (type == "string") list = push(list, arg);
            else if (type == "object") {
               if (isArray(arg)) list = pushMore(list, this.resolve(...arg));
               else for (key in arg) if (arg[key]) list = push(list, key);
            }
         }
      }
      return list || [];
   }

   static block(baseClass: string, styleModifiers: any, stateModifiers: any): string | null {
      let list: any[] | undefined;
      if (baseClass) list = push(list, this.classPrefix + "b-" + baseClass);
      list = pushMap(list, this.resolve(styleModifiers), (m) => this.classPrefix + "m-" + m);
      list = pushMap(list, this.resolve(stateModifiers), (m) => this.classPrefix + "s-" + m);
      return join(list);
   }

   static element(baseClass: string, elementClass: string, stateModifiers: any): string | null {
      let list: any[] | undefined;
      if (baseClass && elementClass) list = push(list, this.classPrefix + "e-" + baseClass + "-" + elementClass);
      list = pushMap(list, this.resolve(stateModifiers), (m) => this.classPrefix + "s-" + m);
      return join(list);
   }

   static state(stateModifiers: any): string | null {
      return join(pushMap(undefined, this.resolve(stateModifiers), (m) => this.classPrefix + "s-" + m));
   }

   static mod(mods: any): string | null {
      return join(pushMap(undefined, this.resolve(mods), (m) => this.classPrefix + "m-" + m));
   }

   static expand(...args: any[]): string | null {
      return join(this.resolve(...args));
   }

   static parseStyle(str: string): any {
      return parseStyle(str);
   }
}

CSS.classPrefix = "cx";

CSSHelper.alias("cx", CSS);
