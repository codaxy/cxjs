import {VDOM, getContent, contentAppend} from '../Widget';
import {Layout} from './Layout';


function validContent(r) {
   var content = [];
   for (var key in r)
      if (key != "label")
         contentAppend(content, r[key]);
   return content;
}

export class LabelsTopLayout extends Layout {
   render(context, instance, keyPrefix) {
      var labels = [];
      var inputs = [];
      var {children} = instance;
      var {CSS, baseClass} = this;
      children.forEach((c, i)=> {
         var r = c.render(context);
         labels.push(<td key={i} className={CSS.element(baseClass, "label")}>{getContent(r.label)}</td>);
         inputs.push(<td key={i} className={CSS.element(baseClass, "field")}>{validContent(r)}</td>);
      });
      return <table key={keyPrefix} className={CSS.block(baseClass, this.mod)}>
         <tbody>
         <tr>{labels}</tr>
         <tr>{inputs}</tr>
         </tbody>
      </table>;
   }
}

LabelsTopLayout.prototype.baseClass = 'labelstoplayout';

Layout.alias('labels-top', LabelsTopLayout);