import {Widget, VDOM} from './Widget';
import {HtmlElement} from './HtmlElement';

export class CxCredit extends HtmlElement {

   init() {
      this.tooltip = {
         mouseTrap: true,
         title: 'Credits',
         items: <cx>
            <div preserveWhitespace>
               User interface of this project is implemented using the Cx framework.
               For more information about Cx, please visit
               <a href="https://cx.codaxy.com/">the Cx product page</a>.
            </div>
         </cx>
      };
      super.init();
   }

   attachProps(context, instance, props) {
      props.children = <svg>
         <text x="50%" y="50%" dy="0.4em">Cx</text>
      </svg> ;
      props.href = "https://cx.codaxy.com/";
   }
}

CxCredit.prototype.baseClass = "cxcredit";
CxCredit.prototype.tag = "a";

Widget.alias('cx-credit', CxCredit);