import { Widget, VDOM } from "../ui/Widget";
import { HtmlElement, HtmlElementConfig, HtmlElementInstance } from "./HtmlElement";
import { Icon } from "./Icon";
import { RenderingContext } from "../ui/RenderingContext";
import { RenderProps } from "../ui/Instance";

export interface CxCreditConfig extends HtmlElementConfig {}

export class CxCredit extends HtmlElement<CxCreditConfig, HtmlElementInstance> {
   declare baseClass: string;

   init(): void {
      this.tooltip = {
         mouseTrap: true,
         title: "Credits",
         items: (
            <cx>
               <div ws>
                  User interface of this project is implemented using the CxJS framework. For more information about
                  CxJS, please visit
                  <a href="https://cxjs.io/" target="_blank">
                     the CxJS homepage
                  </a>
                  .
               </div>
            </cx>
         ),
      };
      super.init();
   }

   attachProps(context: RenderingContext, instance: HtmlElementInstance, props: RenderProps): void {
      props.children = Icon.render("cx", {
         className: this.CSS.element(this.baseClass, "icon"),
      });
   }
}

CxCredit.prototype.baseClass = "cxcredit";
CxCredit.prototype.tag = "div";

Widget.alias("cx-credit", CxCredit);
