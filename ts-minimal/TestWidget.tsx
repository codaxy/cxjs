/** @jsxImportSource react */

import { Widget } from "cx/widgets";
import { RenderingContext, Instance } from "cx/ui";

interface TestWidgetProps {}

export class TestWidget extends Widget {
   constructor(props: TestWidgetProps) {
      super(props);
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      return <div key={key}>Test Widget</div>;
   }
}
