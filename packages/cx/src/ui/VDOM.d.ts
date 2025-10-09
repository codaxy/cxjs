import { HtmlElement } from "cx/widgets";
import { ReactElement, ReactNode } from "react";
import { Root } from "react-dom/client";

export interface VDOM {
   createElement<P extends {}>(type: React.ElementType<P>, props: P, ...children: ReactNode[]): ReactElement<P, any>;
   allowRenderOutputCaching?: boolean;

   DOM: {
      render(reactElement: ReactElement, container: HtmlElement): void;
      unmountComponentAtNode(container: HtmlElement): void;
      createRoot?(container: HtmlElement): Root;
   };
}
