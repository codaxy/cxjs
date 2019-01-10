import {Widget, VDOM} from '../ui/Widget';
import {HtmlElement} from './HtmlElement';
import {Icon} from './Icon';

export class CxCredit extends HtmlElement {

   init() {
      this.tooltip = {
         mouseTrap: true,
         title: 'Credits',
         items: <cx>
            <div ws>
               User interface of this project is implemented using the CxJS framework.
               For more information about CxJS, please visit
               <a href="https://cxjs.io/" target="_blank">the CxJS homepage</a>.
            </div>
         </cx>
      };
      super.init();
   }

   attachProps(context, instance, props) {
      props.children = Icon.render("cx", {
         className: this.CSS.element(this.baseClass, "icon")
      });
   }
}

CxCredit.prototype.baseClass = "cxcredit";
CxCredit.prototype.tag = "div";

Widget.alias('cx-credit', CxCredit);