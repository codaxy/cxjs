import {VDOM, getContent, contentAppend} from '../Widget';
import {Layout} from './Layout';
import {isArray} from '../../util/isArray';

function validContent(r) {
   let content = [];
   for (let key in r)
      if (key != "label")
         contentAppend(content, r[key]);
   return content;
}

export class LabelsTopLayout extends Layout {
   render(context, instance, keyPrefix) {
      let {children} = instance;
      let {CSS, baseClass} = this;
      let content;

      if (this.vertical) {
         let rows = [];

         children.forEach((c, i) => {
            let r = c.vdom; //render(context);
            if (c.widget.layout && c.widget.layout.useParentLayout && isArray(r.content)) {
               r.content.forEach((r, j) => {
                  rows.push(<tr key={`${i}-${j}-label`}>
                     <td className={CSS.element(baseClass, "label")}>
                        {getContent(r.label)}
                     </td>
                  </tr>);
                  rows.push(<tr key={`${i}-${j}-field`}>
                     <td className={CSS.element(baseClass, "field")}>
                        {validContent(r)}
                     </td>
                  </tr>);
               })
            }
            else {
               rows.push(<tr key={`${i}-label`}>
                  <td className={CSS.element(baseClass, "label")}>
                     {getContent(r.label)}
                  </td>
               </tr>);
               rows.push(<tr key={`${i}-field`}>
                  <td className={CSS.element(baseClass, "field")}>
                     {validContent(r)}
                  </td>
               </tr>);
            }
         });

         content = (
            <tbody>
            {rows}
            </tbody>
         );

      } else {
         let labels = [];
         let inputs = [];
         children.forEach((c, i) => {
            let r = c.render(context);
            if (c.widget.layout && c.widget.layout.useParentLayout && isArray(r.content)) {
               r.content.forEach((r, j) => {
                  labels.push(<td key={`${i}-${j}`}
                     className={CSS.element(baseClass, "label")}>{getContent(r.label)}</td>);
                  inputs.push(<td key={`${i}-${j}`} className={CSS.element(baseClass, "field")}>{validContent(r)}</td>);
               })
            }
            else {
               labels.push(<td key={i} className={CSS.element(baseClass, "label")}>{getContent(r.label)}</td>);
               inputs.push(<td key={i} className={CSS.element(baseClass, "field")}>{validContent(r)}</td>);
            }
         });

         content = (
            <tbody>
            <tr>{labels}</tr>
            <tr>{inputs}</tr>
            </tbody>
         );
      }
      return <table key={keyPrefix} className={CSS.block(baseClass, this.mod)}>
         {content}
      </table>;
   }
}

LabelsTopLayout.prototype.baseClass = 'labelstoplayout';
LabelsTopLayout.prototype.vertical = false;

Layout.alias('labels-top', LabelsTopLayout);