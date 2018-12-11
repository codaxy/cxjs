import {isArray} from '../../util/isArray';
import {PureContainer} from "../PureContainer";

//export const UseParentLayout = null;

export class UseParentLayout extends PureContainer {
   // renderChildren(context, instance) {
   //    let result = [];
   //    instance.children.forEach(c => {
   //       let r = c.vdom;
   //       if (c.widget.layout && c.widget.layout.useParentLayout && isArray(r.content)) {
   //          r.content.forEach(r => {
   //             result.push(r);
   //          })
   //       }
   //       else
   //          result.push(r);
   //    });
   //    return result;
   // }
}

UseParentLayout.prototype.noLayout = true;
UseParentLayout.prototype.useParentLayout = true;
