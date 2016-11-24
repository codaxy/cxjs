import {HtmlElement} from './HtmlElement';


export class Heading extends HtmlElement {

   init() {
      this.tag = `h${this.level}`;
      super.init();
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         [`level-${this.level}`]: true
      };
      super.prepareData(context, instance);
   }
}


Heading.prototype.level = 2;
Heading.prototype.baseClass = 'heading';