import { Widget } from "../Widget";
import { PureContainer } from "../PureContainer";

export class Content extends PureContainer {
   declare name?: string;
   declare for?: string;

   init(): void {
      super.init();
      this.putInto = this.for || this.name;
   }
}

Content.prototype.name = "body";
Content.prototype.isContent = true;

Widget.alias("content", Content);
