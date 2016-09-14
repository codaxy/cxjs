import {Widget, VDOM} from '../Widget';
import {HtmlElement} from '../HtmlElement';
import {CSS} from '../CSS';
import {History} from '../../app/History';
import {Url} from '../../app/Url';

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
      var { data, store } = instance;
      var me = this;
      return <a key={key}
                href={data.href}
                className={data.classNames}
                style={data.style}
                tabIndex={this.tabIndex}
                onClick={e=> { me.handleClick(e, data, store) }}>
         {data.text || this.renderChildren(context, instance)}
      </a>;
   }

   handleClick(e, data, store) {
      e.preventDefault();
      if (data.disabled)
         return;
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