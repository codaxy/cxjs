/** @jsxImportSource react */

import { RenderingContext, Instance, Widget } from "cxts/ui";

interface TestWidgetProps {}

export class TestWidget extends Widget {
   constructor(props: TestWidgetProps) {
      super(props);
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      return <div key={key}>Test Widget</div>;
   }
}
