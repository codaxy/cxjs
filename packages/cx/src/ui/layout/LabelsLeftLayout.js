import { VDOM, getContent, contentAppend } from "../Widget";
import { PureContainer } from "../PureContainer";
import { isArray } from "../../util/isArray";
import { parseStyle } from "../../util/parseStyle";

function validContent(r) {
   if (!r.hasOwnProperty("content")) return r;
   let content = [];
   for (let key in r) if (key != "label") contentAppend(content, r[key]);
   return content;
}

export class LabelsLeftLayout extends PureContainer {
   init() {
      this.labelStyle = parseStyle(this.labelStyle);
      super.init();
   }

   declareData(...args) {
      return super.declareData(...args, {
         labelStyle: { structured: true },
         labelClass: { structured: true },
      });
   }

   render(context, instance, key) {
      let result = [];
      let { children, data } = instance;
      let { CSS, baseClass } = this;

      console.log(this.labelStyle, data.labelStyle, data.style);

      let labelClass = CSS.expand(CSS.element(baseClass, "label"), data.labelClass);

      const addItem = (r, key) => {
         if (!r) return;
         if (r.useParentLayout && isArray(r.content)) r.content.forEach((x, i) => addItem(x, key + "-" + i));
         else {
            result.push(
               <tr key={key}>
                  <td className={labelClass} style={data.labelStyle}>
                     {getContent(r.label)}
                  </td>
                  <td className={CSS.element(baseClass, "field")}>{validContent(r)}</td>
               </tr>
            );
         }
      };
      children.forEach((c) => {
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
