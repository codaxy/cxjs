import {VDOM, getContent, contentAppend} from '../Widget';
import {PureContainer} from '../PureContainer';
import {isArray} from '../../util/isArray';


function validContent(r) {
   if (!r.hasOwnProperty("content"))
      return r;
   let content = [];
   for (let key in r)
      if (key != "label")
         contentAppend(content, r[key]);
   return content;
}

export class LabelsLeftLayout extends PureContainer {
   render(context, instance, key) {
      let result = [];
      let {children} = instance;
      let {CSS, baseClass} = this;

      const addItem = (r, key) => {
         if (!r)
            return;
         if (r.useParentLayout && isArray(r.content))
            r.content.forEach((x, i) => addItem(x, key + '-' + i));
         else {
            result.push(<tr key={key}>
               <td className={CSS.element(baseClass, "label")}>{getContent(r.label)}</td>
               <td className={CSS.element(baseClass, "field")}>{validContent(r)}</td>
            </tr>);
         }
      };
      children.forEach((c, i) => {
         addItem(c.vdom, i.toString());
      });
      return <table key={key} className={CSS.block(baseClass, this.mod)}>
         <tbody>{result}</tbody>
      </table>;
   }
}

LabelsLeftLayout.prototype.baseClass = 'labelsleftlayout';