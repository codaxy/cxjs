import {VDOM, getContent, contentAppend} from '../Widget';
import {Layout} from './Layout';
import {isArray} from '../../util/isArray';


function validContent(r) {
   var content = [];
   for (var key in r)
      if (key != "label")
         contentAppend(content, r[key]);
   return content;
}

export class LabelsLeftLayout extends Layout {
   render(context, instance, keyPrefix) {
      var result = [];
      var {children} = instance;
      var {CSS, baseClass} = this;
      children.forEach((c, i)=> {
         var r = c.vdom ;//render(context);
         if (r) {
            if (c.widget.layout && c.widget.layout.useParentLayout && isArray(r.content)) {
               r.content.forEach((r, j)=> {
                  result.push(<tr key={`${i}-${j}`}>
                     <td className={CSS.element(baseClass, "label")}>{getContent(r.label)}</td>
                     <td className={CSS.element(baseClass, "field")}>{validContent(r)}</td>
                  </tr>)
               })
            }
            else {
               result.push(<tr key={i}>
                  <td className={CSS.element(baseClass, "label")}>{getContent(r.label)}</td>
                  <td className={CSS.element(baseClass, "field")}>{validContent(r)}</td>
               </tr>);
            }
         }
      });
      return <table key={keyPrefix} className={CSS.block(baseClass, this.mod)}>
         <tbody>{result}</tbody>
      </table>;
   }
}

LabelsLeftLayout.prototype.baseClass = 'labelsleftlayout';

Layout.alias('labels-left', LabelsLeftLayout);