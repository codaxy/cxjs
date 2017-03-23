import {Widget, VDOM, getContent} from '../../ui/Widget';
import {Overlay, OverlayComponent} from './Overlay';
import {ContentPlaceholder, contentSandbox} from '../../ui/layout/ContentPlaceholder';
import {ZIndexManager} from '../../ui/ZIndexManager';
import {Button} from '../Button';
import CloseIcon from '../icons/close';
import {parseStyle} from '../../util/parseStyle';
import {Localization} from '../../ui/Localization';

export class Window extends Overlay {

   init() {
      if (typeof this.headerStyle == 'string')
         this.headerStyle = parseStyle(this.headerStyle);

      if (typeof this.footerStyle == 'string')
         this.footerStyle = parseStyle(this.footerStyle);

      if (typeof this.bodyStyle == 'string')
         this.bodyStyle = parseStyle(this.bodyStyle);

      super.init();
   }

   declareData() {
      return super.declareData(...arguments, {
         title: undefined,
         closable: undefined,
         bodyStyle: {structured: true},
         headerStyle: {structured: true},
         footerStyle: {structured: true},
      });
   }

   initComponents() {
      return super.initComponents(...arguments, {
         header: Widget.create(this.header || {type: ContentPlaceholder, name: 'header'}),
         footer: Widget.create(this.footer || {type: ContentPlaceholder, name: 'footer'}),
         close: this.closable && Widget.create(Button, {
            mod: 'hollow',
            dismiss: true,
            icon: 'close',
            style: 'margin-left: auto'
         })
      });
   }

   explore(context, instance) {
      //prevent header and footer content to be defined outside the window or
      //interfere with the environment
      contentSandbox(context, "header", () => {
         contentSandbox(context, "footer", () => {
            super.explore(context, instance);
         })
      })
   }

   renderHeader(context, instance, key) {
      let {data} = instance;
      let result = [];
      if (data.title)
         result.push(data.title);
      if (instance.components) {
         let header = getContent(instance.components.header && instance.components.header.render(context, key));
         if (header)
            result.push(header);
         if (data.closable && instance.components.close)
            result.push(getContent(instance.components.close.render(context)));
      }
      return result;
   }

   renderFooter(context, instance, key) {
      return getContent(instance.components && instance.components.footer && instance.components.footer.render(context, key));
   }

   render(context, instance, key) {
      var header = this.renderHeader(context, instance, 'header');
      var footer = this.renderFooter(context, instance, 'footer');
      return <WindowComponent key={key} instance={instance} header={header} footer={footer}>
         {this.renderContents(context, instance)}
      </WindowComponent>;
   }
}

Window.prototype.baseClass = 'window';
Window.prototype.closable = true;
Window.prototype.resizable = false;
Window.prototype.autoFocus = true;
Window.prototype.focusable = true;

Widget.alias('window', Window);
Localization.registerPrototype("cx/widgets/Window", Window);

class WindowComponent extends OverlayComponent {

   renderOverlayBody() {
      var {widget, data} = this.props.instance;
      var {CSS, baseClass} = widget;

      let header, footer;

      if (this.props.header.length > 0) {
         header = (
            <header
               key="header"
               ref={ c => {
                  this.headerEl = c
               }}
               className={CSS.element(baseClass, 'header')}
               style={data.headerStyle}
               onMouseDown={::this.onHeaderMouseDown}
               onTouchStart={::this.onHeaderMouseDown}
            >
               { this.props.header }
            </header>
         )
      }

      if (this.props.footer) {
         footer = (
            <footer
               key="footer"
               ref={ c => {
                  this.footerEl = c
               }}
               className={CSS.element(baseClass, 'footer')}
               style={data.footerStyle}
            >

               {this.props.footer}
            </footer>
         )
      }

      var bodyStyle = data.bodyStyle;
      {/*if (this.el) {*/}
         {/*//set body height to spread across available window height.*/}
      //    var nonBodyHeight = 0;
      //    if (this.headerEl)
      //       nonBodyHeight += this.headerEl.offsetHeight;
      //    if (this.footerEl)
      //       nonBodyHeight += this.footerEl.offsetHeight;
      //    bodyStyle = {
      //       ...bodyStyle,
      //       height: `calc(100% - ${nonBodyHeight}px`
      //    };
      // }

      var body = (
         <div
            key="body"
            ref={ c => {
               this.bodyEl = c
            }}
            className={CSS.element(widget.baseClass, 'body')}
            style={bodyStyle}>
            {this.props.children}
         </div>
      );

      return [
         header,
         body,
         footer
      ]
   }

   getOverlayCssClass() {
      var cls = super.getOverlayCssClass();
      if (this.state.active)
         cls += ' cxs-active';
      return cls;
   }

   onFocusIn() {
      super.onFocusIn();
      if (!this.state.active) {
         this.setState({
            active: true
         }, () => {
            this.setZIndex(ZIndexManager.next());
         });
      }
   }

   onFocusOut() {
      super.onFocusOut();
      if (this.state.active) {
         this.setState({
            active: false
         });
      }
   }

   onHeaderMouseDown(e) {
      this.startMoveOperation(e);
      e.stopPropagation();
   }
}

WindowComponent.prototype.focusable = true;