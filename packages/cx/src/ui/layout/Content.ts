import { Widget } from "../Widget";
import { PureContainerBase, PureContainerConfig } from "../PureContainer";
import { Instance } from "../Instance";

export interface ContentConfig extends PureContainerConfig {
   /** Placeholder name where the content is rendered. */
   name?: string;

   /** Placeholder name where the content is rendered. */
   for?: string;
}

export class Content extends PureContainerBase<ContentConfig, Instance> {
   declare name?: string;
   declare for?: string;

   constructor(config?: ContentConfig) {
      super(config);
   }

   init(): void {
      super.init();
      if (!this.putInto) this.putInto = this.for || this.name;
   }
}

Content.prototype.name = "body";
Content.prototype.isContent = true;

Widget.alias("content", Content);
