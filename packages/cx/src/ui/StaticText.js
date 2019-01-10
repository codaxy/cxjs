import {Widget} from './Widget';

export class StaticText extends Widget {
   render() {
      return this.text;
   }
}

Widget.alias('static-text', StaticText);
