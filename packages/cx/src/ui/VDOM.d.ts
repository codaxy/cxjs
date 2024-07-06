import { HtmlElement, react } from "cx/widgets";
import { ReactElement } from "react";
export interface VDOM {
   createElement(type, props, ...children);
   allowRenderOutputCaching?: boolean;

   DOM: {
      render(reactElement: ReactElement, container: HtmlElement): void;
      unmountComponentAtNode(container: HtmlElement): void;
      createRoot?(container: HtmlElement): any;
   };
}
