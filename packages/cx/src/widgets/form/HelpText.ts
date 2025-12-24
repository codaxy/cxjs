import { Widget } from "../../ui/Widget";
import { HtmlElement, HtmlElementConfig } from "../HtmlElement";

export interface HelpTextConfig extends HtmlElementConfig {}

export class HelpText extends HtmlElement {
   constructor(config?: HelpTextConfig) {
      super(config);
   }
}

HelpText.prototype.tag = "span";
HelpText.prototype.baseClass = "helptext";

Widget.alias("help-text", HelpText);
