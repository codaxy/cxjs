/** @jsxImportSource react */

import { isArray } from "../../util/isArray";
import { parseStyle } from "../../util/parseStyle";
import { PureContainer } from "../PureContainer";
import { RenderingContext } from "../RenderingContext";
import { contentAppend, getContent } from "../Widget";

function validContent(r: any): any {
   if (!r.hasOwnProperty("content")) return r;
   let content: any[] = [];
   for (let key in r) if (key != "label") contentAppend(content, r[key]);
   return content;
}

export class LabelsLeftLayout extends PureContainer {
   labelStyle?: any;
   // baseClass, styled, CSS inherited from Widget

   init(): void {
      this.labelStyle = parseStyle(this.labelStyle);
      super.init();
   }

   declareData(...args: any[]): any {
      return super.declareData(...args, {
         labelStyle: { structured: true },
         labelClass: { structured: true },
      });
   }

   render(context: RenderingContext, instance: any, key: any): any {
      let result: any[] = [];
      let { children, data } = instance;
      let { CSS, baseClass } = this;

      let labelClass = CSS!.expand(CSS!.element(baseClass!, "label"), data.labelClass);

      const addItem = (r: any, key: string) => {
         if (!r) return;
         if (r.useParentLayout && isArray(r.content))
            r.content.forEach((x: any, i: number) => addItem(x, key + "-" + i));
         else {
            result.push(
               <tr key={key}>
                  <td className={labelClass} style={data.labelStyle}>
                     {getContent(r.label)}
                  </td>
                  <td className={CSS!.element(baseClass!, "field")}>{validContent(r)}</td>
               </tr>,
            );
         }
      };
      children.forEach((c: any) => {
         addItem(c.vdom, c.key);
      });
      return (
         <table key={key} className={data.classNames} style={data.style}>
            <tbody>{result}</tbody>
         </table>
      );
   }
}

LabelsLeftLayout.prototype.baseClass = "labelsleftlayout";
LabelsLeftLayout.prototype.styled = true;
