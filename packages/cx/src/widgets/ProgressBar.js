import {Widget, VDOM, getContent} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';
import {isString} from '../util/isString';
import {parseStyle} from '../util/parseStyle';

export class ProgressBar extends Widget {

   init() {
      if (isString(this.text))
         this.text = parseStyle(this.text);

      super.init();
   }

   // add(item) {
   //    if (item && item.putInto == 'header')
   //       this.header = {
   //          ...item,
   //          putInto: null
   //       };
   //    else if (item && item.putInto == 'footer')
   //       this.footer = {
   //          ...item,
   //          putInto: null
   //       };
   //    else
   //       super.add(...arguments);
   // }

   declareData() {
      return super.declareData({
         id: undefined,
         text: {structured: true},
         value: {structured: true}
      })
   }

   initComponents() {
      super.initComponents({
         text: this.getText()      
      });
   }

   prepareData(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         pad: this.pad
      };
      super.prepareData(context, instance);
   }

   initInstance(context, instance) {
      instance.eventHandlers = instance.getJsxEventProps();
      super.initInstance(context, instance);
   }

   render(context, instance, key) {
      let {data, components, eventHandlers} = instance;
      let text, value;
      let {CSS, baseClass} = this;

      // if (components.footer) {
      //    footer = (
      //       <footer
      //          className={CSS.expand(CSS.element(baseClass, 'footer'), data.footerClass)}
      //          style={data.footerStyle}
      //       >
      //          {getContent(components.footer.render(context))}
      //       </footer>
      //    );
      // }

      return (
         <div
            key={key}
            className={data.classNames}
            style={data.style}
            text={data.text}
            id={data.id}
            {...eventHandlers}
         >
            { header }
            <div className={CSS.expand(CSS.element(this.baseClass, 'body'), data.bodyClass)} style={data.bodyStyle}>
               <div className="inner-progressbar" width={data.value}>
            </div>
         </div>
      )
   }
}


Section.prototype.styled = true;
Section.prototype.pad = true;
Section.prototype.baseClass = 'section';
Section.prototype.hLevel = 3;
