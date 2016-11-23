import {Widget, VDOM, getContent} from './Widget';
import {PureContainer} from './PureContainer';
import {Text} from './Text';
import {StaticText} from './StaticText';
import {parseStyle} from '../util/parseStyle';

export class Section extends PureContainer {

   init() {
      if (typeof this.headerStyle == 'string')
         this.headerStyle = parseStyle(this.headerStyle);
      super.init();
   }

   declareData() {
      return super.declareData({
         headerStyle: {structured: true},
         headerClass: {structured: true}
      })
   }

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
      let {CSS, baseClass} = this;

      if (components.header)
         header = (
            <header
               className={CSS.expand(CSS.element(baseClass, 'header'), data.headerClass)}
               style={data.headerStyle}
            >
               {getContent(components.header.render(context))}
            </header>
         );

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