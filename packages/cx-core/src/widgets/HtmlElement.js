import {Widget, VDOM} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';
import {tooltipMouseMove, tooltipComponentWillReceiveProps, tooltipComponentWillUnmount, tooltipMouseLeave, tooltipComponentDidMount} from './overlay/Tooltip';
import {Url} from '../ui/app/Url';
import {parseStyle} from '../util/parseStyle';
import {Console} from '../util/Console';

var isDataAttribute = attr => attr.indexOf('data-') == 0 ? attr.substring(5) : false;

export var urlAttributes = {
   'a.href': true,
   'img.src': true
};

export class HtmlElement extends PureContainer {

   init() {
      if (this.innerText)
         this.text = this.innerText;

      if (this.html)
         this.innerHtml = this.html;
   }

   declareData() {

      var data = {
         text: undefined,
         innerHtml: undefined,
         tooltip: {
            structured: true
         },
         attrs: {
            structured: true
         },
         data: {
            structured: true
         }
      };

      var name;

      this.urlAttributes = [];

      if (this.jsxAttributes) {
         this.jsxAttributes.forEach(attr => {

            if (urlAttributes[`${this.tag}.${attr}`])
               this.urlAttributes.push(attr);

            if ((name = isDataAttribute(attr))) {
               if (!this.data)
                  this.data = {};
               this.data[name] = this[attr];
            }
            else if ((name = this.isValidHtmlAttribute(attr)) && !data.hasOwnProperty(name)) {
               if (name.indexOf('on') == 0) {
                  if (!this.events)
                     this.events = {};
                  this.events[name] = this[attr];
               } else {
                  if (!this.attrs)
                     this.attrs = {};
                  this.attrs[name] = this[attr];
               }
            }
         });
      }

      if (this.urlAttributes.length == 0)
         delete this.urlAttributes;

      super.declareData(...arguments, data);
   }

   isValidHtmlAttribute(attrName) {
      switch (attrName) {
         case 'layout':
         case 'class':
         case 'className':
         case 'style':
         case 'controller':
         case 'outerLayout':
         case 'items':
         case 'children':
         case 'visible':
         case 'if':
         case 'mod':
         case 'putInto':
         case 'contentFor':
         case 'trimWhitespace':
         case 'preserveWhitespace':
         case 'ws':
         case 'plainText':
         case 'vertical':
         case 'memoize':
         case "onInit":
         case "onExplore":
         case "html":
         case "innerText":
         case "baseClass":
            return false;

         default:
            if (isDataAttribute(attrName))
               return false;

            break;
      }

      return attrName;
   }
   
   init() {

      if(this.html)
         this.innerHtml = this.html;
         
      if(this.innerText)
         this.text = this.innerText;         

      this.style = parseStyle(this.style);
      super.init();
   }

   prepareData(context, instance) {
      var {data} = instance;
      if (this.urlAttributes && data.attrs)
         this.urlAttributes.forEach(attr=> {
            if (typeof data.attrs[attr] == 'string')
               data.attrs[attr] = Url.resolve(data.attrs[attr]);
         });
      super.prepareData(context, instance);
   }

   attachProps(context, instance, props) {
      Object.assign(props, this.extraProps);
   }

   render(context, instance, key) {

      //rebind events to pass instance
      if (this.events && !instance.events) {
         instance.events = {};
         for (var eventName in this.events) {
            let ev = eventName;
            instance.events[ev] = e => this.events[ev].call(this, e, instance);
         }
      }

      var {data, events} = instance;

      var props = Object.assign({
         key: key,
         className: data.classNames,
         style: data.style
      }, data.attrs, events);

      var children;
      if (typeof data.text != 'undefined')
         children = data.text;
      else if (typeof data.innerHtml == 'string') {
         props.dangerouslySetInnerHTML = {__html: data.innerHtml};
      }
      else {
         children = this.renderChildren(context, instance);
         if (children && Array.isArray(children) && children.length == 0)
            children = undefined;
      }

      props.children = children;

      this.attachProps(context, instance, props);

      if (this.memoize || data.tooltip)
         return <ContainerComponent key={key} tag={this.tag} props={props} instance={instance}/>

      return VDOM.createElement(this.tag, props, props.children);
   }
}

HtmlElement.prototype.tag = 'div';
HtmlElement.prototype.styled = true;

class ContainerComponent extends VDOM.Component {
   shouldComponentUpdate(props) {
      return props.instance.shouldUpdate;
   }

   render() {
      var {tag, props, instance} = this.props;
      var {data} = instance;

      props.ref = c => { this.el = c };

      if (data.tooltip) {
         var {onMouseLeave, onMouseMove} = props;

         props.onMouseLeave = (e) => {
            tooltipMouseLeave(e, instance);
            if (onMouseLeave) onMouseLeave(e);
         };
         props.onMouseMove = (e) => {
            tooltipMouseMove(e, instance);
            if (onMouseMove) onMouseMove(e);
         }
      }

      return VDOM.createElement(tag, props, props.children);
   }

   componentWillUnmount() {
      tooltipComponentWillUnmount(this.el, this.props.instance);
   }

   componentWillReceiveProps(props) {
      tooltipComponentWillReceiveProps(this.el, props.instance);
   }

   componentDidMount() {
      tooltipComponentDidMount(this.el, this.props.instance);
   }
}

var originalWidgetFactory = Widget.factory;

//support for pure components
Widget.factory = function(type, config, more) {
   var typeType = typeof type;

   if (typeType == 'undefined') {
      Console.log('Creating a widget of unknown type.', config, more);
      return new HtmlElement(Object.assign({}, config, more));
   }

   if (typeType == 'function') {
      var props = Object.assign({}, config, more);
      var items = props.children;
      delete props.children;
      return new HtmlElement({
         ...props,
         tag: type,
         items: items
      })
   }

   return originalWidgetFactory.call(Widget, type, config, more);
}

Widget.alias('html-element', HtmlElement);