import {Widget} from './Widget';

export class StaticText extends Widget {
   text?: string;

   render() {
      return this.text;
   }
}

Widget.alias('static-text', StaticText);
