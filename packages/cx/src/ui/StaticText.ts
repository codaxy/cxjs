import {Widget} from './Widget';

export class StaticText extends Widget {
   declare text?: string;

   render() {
      return this.text;
   }

   // subclasses may keep more in their instances
   canShareInstance(): boolean {
      return this.constructor === StaticText;
   }
}

Widget.alias('static-text', StaticText);
