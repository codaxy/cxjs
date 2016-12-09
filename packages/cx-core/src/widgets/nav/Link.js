import {Widget, VDOM} from '../../ui/Widget';
import {HtmlElement} from '../HtmlElement';
import {History} from '../../ui/app/History';
import {Url} from '../../ui/app/Url';

export class Link extends HtmlElement {

   declareData() {
      super.declareData({
         disabled: undefined,
         href: undefined,
         text: undefined,
         url: undefined
      }, ...arguments);
   }

   prepareData(context, instance) {
      var {data} = instance;
      data.stateMods = {
         disabled: data.disabled,
         active: this.isActive(data)
      };
      if (typeof data.href == 'string')
         data.href = Url.resolve(data.href);
      super.prepareData(context, instance);
   }

   isActive(data) {
      switch (this.match) {
         default:
         case 'equal':
            return data.url == data.href;

         case 'prefix':
            return data.url && data.href && data.url.indexOf(data.href) == 0;
      }
   }

   render(context, instance, key) {
      let {data} = instance;
      return <a key={key}
                href={data.href}
                className={data.classNames}
                style={data.style}
                tabIndex={this.tabIndex}
                onClick={e=> {
                   this.handleClick(e, instance)
                }}>
         {data.text || this.renderChildren(context, instance)}
      </a>;
   }

   handleClick(e, instance) {
      let {data} = instance;
      e.preventDefault();
      if (data.disabled)
         return;

      if (this.onClick)
         this.onClick(e, instance);

      if (History.pushState({}, null, data.href)) {
         e.stopPropagation();
         e.preventDefault();
      }
   }
}

Link.prototype.baseClass = "link";
Link.prototype.tag = 'a';
Link.prototype.match = "equal";

Widget.alias('link', Link);