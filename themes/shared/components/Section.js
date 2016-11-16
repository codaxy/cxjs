import {Widget, VDOM, getContent} from 'cx/ui/Widget';
import {PureContainer} from 'cx/ui/PureContainer';
import {Text} from 'cx/ui/Text';
import {StaticText} from 'cx/ui/StaticText';

export class Section extends PureContainer {

   // declareData() {
   //    return super.declareData(...arguments, {})
   // }

   initComponents() {
      super.initComponents({
         header: this.getHeader()
      });
   }

   getHeader() {
      if (this.title) {
         if (typeof this.title == 'string')
            return Widget.create(StaticText, {text: this.title});

         return Widget.create(Text, this.title);
      }
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         pad: this.pad
      };
      super.prepareData(context, instance);
   }

   render(context, instance, key) {
      let {data, components} = instance;
      let header;

      if (components.header)
         header = <header className={this.CSS.element(this.baseClass, 'header')}>
            {getContent(components.header.render(context))}
         </header>;

      return <section key={key} className={data.classNames} style={data.style}>
         { header }
         <div className={this.CSS.element(this.baseClass, 'body')}>
            {this.renderChildren(context, instance)}
         </div>
      </section>
   }
}


Section.prototype.styled = true;
Section.prototype.pad = true;
Section.prototype.baseClass = 'section';