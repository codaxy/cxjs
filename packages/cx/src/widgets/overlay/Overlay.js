import {Widget, VDOM} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';
import {startAppLoop} from '../../ui/app/startAppLoop';
import {FocusManager, oneFocusOut, offFocusOut} from '../../ui/FocusManager';
import {isSelfOrDescendant} from '../../util/DOM';
import {captureMouseOrTouch} from './captureMouse';

/*
 Features:
 - renders itself on top of other elements
 - provide resizing capabilities
 - adds positioning hook and ability to position itself in the center of the page
 - provides header, body, and footer elements and updates body's height on resize (move this to Window)
 - stop mouse events from bubbling to parents, but allow keystrokes
 */

export class Overlay extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         style: {
            structured: true
         },
         class: {
            structured: true
         },
         className: {
            structured: true
         },
         resizable: undefined,
         draggable: undefined
      });
   }

   prepareData(context, instance) {
      var {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         inline: this.inline,
         modal: this.modal,
         pad: this.pad,
         resizable: data.resizable,
         draggable: data.draggable
      };

      super.prepareData(context, instance);
   }

   initInstance(context, instance) {
      if (this.visible && this.visible.bind) {
         instance.dismiss = () => {
            if (instance.onBeforeDismiss && instance.onBeforeDismiss() == false)
               return;
            instance.set('visible', false)
         };
      }
   }

   explore(context, instance) {
      var oldParentOptions = context.parentOptions;

      if (context.options.dismiss)
         instance.dismiss = context.options.dismiss;

      if (instance.dismiss)
         context.parentOptions = {
            ...context.parentOptions,
            dismiss: instance.dismiss
         };

      if (instance.dismiss != instance.cached.dismiss)
         instance.shouldUpdate = true;

      super.explore(context, instance);
      context.parentOptions = oldParentOptions;
   }

   cleanup(context, instance) {
      super.cleanup(context, instance);
      instance.cached.dismiss = instance.dismiss;
   }

   render(context, instance, key) {
      return <OverlayComponent key={key}
         instance={instance}
         subscribeToBeforeDismiss={context.options.subscribeToBeforeDismiss}
         parentEl={context.options.parentEl}>
         {this.renderContents(context, instance)}
      </OverlayComponent>
   }

   renderContents(context, instance) {
      return this.renderChildren(context, instance);
   }

   overlayDidMount(instance, component) {
      if (this.center) {
         var {el} = component;
         el.style.left = `${(window.innerWidth - el.offsetWidth) / 2}px`;
         el.style.top = `${(window.innerHeight - el.offsetHeight) / 2}px`;
      }
   }

   overlayDidUpdate(instance, component) {

   }

   overlayWillUnmount(instance, component) {

   }

   handleFocusOut(instance, component) {
      if (this.onFocusOut)
         this.onFocusOut(instance, component);

      if (this.dismissOnFocusOut && instance.dismiss)
         instance.dismiss();
   }

   handleKeyDown(e, instance, component) {
      if (this.onKeyDown)
         this.onKeyDown(e, instance, component);
   }

   handleMouseLeave(instance, component) {
      if (this.onMouseLeave)
         this.onMouseLeave(instance, component);
   }

   handleMouseEnter(instance, component) {
      if (this.onMouseEnter)
         this.onMouseEnter(instance, component);
   }

   containerFactory() {
      let el = document.createElement('div');
      document.body.appendChild(el);
      return el;
   }

   open(storeOrInstance, options) {
      if (!this.initialized)
         this.init();

      let el = this.containerFactory();
      el.style.display = "hidden";

      let beforeDismiss, stop;

      options = {
         destroyDelay: this.destroyDelay,
         removeParentDOMElement: true,
         ...options,
         parentEl: el,
         dismiss: () => {
            if (beforeDismiss && beforeDismiss() === false)
               return;
            stop();
            beforeDismiss = null;
         },
         subscribeToBeforeDismiss: cb => {
            beforeDismiss = cb;
         }
      };
      options.name = options.name || 'overlay';
      stop = startAppLoop(el, storeOrInstance, this, options);
      return options.dismiss;
   }
}

Overlay.prototype.baseClass = 'overlay';
Overlay.prototype.resizable = false;
Overlay.prototype.resizeWidth = 7;
Overlay.prototype.center = false;
Overlay.prototype.modal = false;
Overlay.prototype.backdrop = false;
Overlay.prototype.inline = false;
Overlay.prototype.autoFocus = false;
Overlay.prototype.animate = false;
Overlay.prototype.draggable = false;
Overlay.prototype.destroyDelay = 0;
Overlay.prototype.dismissOnFocusOut = false;
Overlay.prototype.focusable = false;

Widget.alias('overlay', Overlay);

export class OverlayComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {};
      this.customStyle = {};
   }

   render() {
      var {instance, parentEl} = this.props;
      var {widget} = instance;

      if (widget.inline || parentEl)
         return this.renderOverlay();

      return null;
   }

   renderOverlay() {

      let {widget, data} = this.props.instance;
      let {CSS, baseClass} = widget;

      let content = (
         <div
            ref={el => {
               this.el = el
            }}
            className={data.classNames}
            style={data.style}
            tabIndex={widget.focusable ? 0 : null}
            onFocus={::this.onFocus}
            onBlur={::this.onBlur}
            onKeyDown={::this.onKeyDown}
            onMouseMove={::this.onMouseMove}
            onMouseUp={::this.onMouseUp}
            onMouseDown={::this.onMouseDown}
            onTouchStart={::this.onMouseDown}
            onMouseEnter={::this.onMouseEnter}
            onMouseLeave={::this.onMouseLeave}
         >
            { widget.modal || widget.backdrop && <div key="backdrop" className={CSS.element(baseClass, 'modal-backdrop')} onClick={::this.onBackdropClick} /> }
            {this.renderOverlayBody()}
         </div>
      );

      let result = content;

      if (widget.modal || widget.backdrop) {
         result = (
            <div
               key="shadow"
               ref={el => {
                  this.shadowEl = el
               }}
               className={CSS.element(baseClass, 'shadow', {animated: this.state.animated})}
            >
               {content}
            </div>
         );
      }

      return result;
   }

   renderOverlayBody() {
      return this.props.children;
   }

   onFocus() {
      FocusManager.nudge();
      this.onFocusIn();
      if (this.el)
         oneFocusOut(this, this.el, ::this.onFocusOut);
   }

   onBlur() {
      FocusManager.nudge();
   }

   onFocusIn() {
   }

   onFocusOut() {
      var {widget} = this.props.instance;
      widget.handleFocusOut(this.props.instance, this);
   }

   onMouseEnter(e) {
      var {widget} = this.props.instance;
      widget.handleMouseEnter(this.props.instance, this);
   }

   onMouseLeave(e) {
      var {widget} = this.props.instance;
      widget.handleMouseLeave(this.props.instance, this);
   }

   onKeyDown(e) {
      var {widget} = this.props.instance;
      widget.handleKeyDown(e, this.props.instance, this);
   }

   getResizePrefix(e) {
      var {widget, data} = this.props.instance;
      if (!data.resizable)
         return '';
      var cursor = this.getCursorPos(e);
      var bounds = this.el.getBoundingClientRect();
      var leftMargin = cursor.clientX - bounds.left;
      var rightMargin = bounds.right - cursor.clientX;
      var topMargin = cursor.clientY - bounds.top;
      var bottomMargin = bounds.bottom - cursor.clientY;
      var prefix = '';

      if (topMargin >= 0 && topMargin < widget.resizeWidth)
         prefix += 'n';
      else if (bottomMargin >= 0 && bottomMargin < widget.resizeWidth)
         prefix += 's';

      if (leftMargin >= 0 && leftMargin < widget.resizeWidth)
         prefix += 'w';
      else if (rightMargin >= 0 && rightMargin < widget.resizeWidth)
         prefix += 'e';
      return prefix;
   }

   onMouseDown(e) {
      var {data} = this.props.instance;
      var prefix = this.getResizePrefix(e);
      if (prefix) {
         //e.preventDefault();
         e.stopPropagation();
         var rect = this.el.getBoundingClientRect();
         var cursor = this.getCursorPos(e);
         var captureData = {
            prefix: prefix,
            dl: cursor.clientX - rect.left,
            dt: cursor.clientY - rect.top,
            dr: cursor.clientX - rect.right,
            db: cursor.clientY - rect.bottom,
            rect: rect
         };
         captureMouseOrTouch(e, ::this.onMouseMove, null, captureData, prefix + '-resize');
      }
      else if (data.draggable) {
         this.startMoveOperation(e);
         e.stopPropagation();
      }

      e.stopPropagation();
   }

   onBackdropClick(e) {
      e.stopPropagation();
      var {instance} = this.props;
      var {widget} = instance;

      if (widget.onBackdropClick)
         widget.onBackdropClick(e, instance);

      if (widget.backdrop) {
         if (instance.dismiss)
            instance.dismiss();
      }
   }

   onMouseUp(e) {
      e.stopPropagation();
   }

   onMouseMove(e, captureData) {
      if (captureData && captureData.prefix) {
         var {prefix, rect, dl, dt, dr, db} = captureData;
         var cursor = this.getCursorPos(e);

         if (prefix.indexOf('w') != -1)
            this.setCustomStyle({
               left: (cursor.clientX - dl) + 'px',
               width: (rect.right - cursor.clientX + dl) + 'px',
               right: 'auto'
            });

         if (prefix.indexOf('n') != -1)
            this.setCustomStyle({
               top: (cursor.clientY - dt) + 'px',
               height: (rect.bottom - cursor.clientY + dt) + 'px',
               bottom: 'auto'
            });

         if (prefix.indexOf('e') != -1)
            this.setCustomStyle({
               width: (cursor.clientX - dr - rect.left) + 'px',
               left: `${rect.left}px`,
               right: 'auto'
            });

         if (prefix.indexOf('s') != -1)
            this.setCustomStyle({
               height: (cursor.clientY - db - rect.top) + 'px',
               top: `${rect.top}px`,
               bottom: 'auto'
            });
      }
      else {
         var prefix = this.getResizePrefix(e);
         this.setCustomStyle({
            cursor: prefix ? prefix + '-resize' : null
         });
      }
   }

   getCursorPos(e) {
      let x = (e.touches && e.touches[0]) || e;
      return {
         clientX: x.clientX,
         clientY: x.clientY
      };
   }

   startMoveOperation(e) {
      if (this.el && !this.getResizePrefix(e)) {
         e.stopPropagation();
         var rect = this.el.getBoundingClientRect();
         var cursor = this.getCursorPos(e);
         var data = {
            dx: cursor.clientX - rect.left,
            dy: cursor.clientY - rect.top
         };

         captureMouseOrTouch(e, ::this.onMove, null, data, getComputedStyle(e.target).cursor);
      }
   }

   onMove(e, data) {
      if (data) {
         var cursor = this.getCursorPos(e);
         e.preventDefault();
         this.setCustomStyle({
            left: (cursor.clientX - data.dx) + 'px',
            top: (cursor.clientY - data.dy) + 'px',
            right: 'auto',
            bottom: 'auto'
         });
      }
   }

   onBeforeDismiss() {
      let {instance} = this.props;
      let {widget} = instance;

      if (widget.overlayWillDismiss && widget.overlayWillDismiss(instance, this) === false)
         return false;

      //this.el might be null if visible is set to false
      if (this.el) {
         if (widget.animate)
            this.setState({
               animated: false
            });

         //verify this is really needed
         //this.el.className = this.getOverlayCssClass();
      }

      return true;
   }

   componentDidMount() {
      let {instance, subscribeToBeforeDismiss, parentEl} = this.props;
      let {widget} = instance;
      if (!parentEl && !widget.inline) {
         this.ownedEl = widget.containerFactory();
         this.ownedEl.style.display = 'hidden';
         this.containerEl = this.ownedEl;
      }

      this.componentDidUpdate();

      widget.overlayDidMount(instance, this);

      if (this.containerEl)
         this.containerEl.style.display = null;
      else if (parentEl)
         parentEl.style.display = null;

      if (widget.autoFocus)
         FocusManager.focusFirst(this.el);
      else if (isSelfOrDescendant(this.el, document.activeElement))
         oneFocusOut(this, this.el, ::this.onFocusOut);

      instance.onBeforeDismiss = ::this.onBeforeDismiss;

      if (subscribeToBeforeDismiss) {
         subscribeToBeforeDismiss(instance.onBeforeDismiss);
      }

      if (widget.animate) {
         setTimeout(() => {
            if (!this.unmounting)
               this.setState({
                  animated: true
               });
         }, 0);
      }
   }

   componentWillUnmount() {

      offFocusOut(this);
      this.unmounting = true;

      let {baseClass, CSS} = this.props.instance.widget;

      // //we didn't have a chance to call onBeforeDismiss
      if (this.state.animated && this.el) {
         this.el.className = this.getOverlayCssClass();
         if (this.shadowEl)
            this.shadowEl.className = CSS.element(baseClass, 'shadow');
      }

      let {widget} = this.props.instance;

      widget.overlayWillUnmount(this.props.instance, this);

      if (this.ownedEl) {
         setTimeout(() => {
            if (this.ownedEl.parentNode)
               this.ownedEl.parentNode.removeChild(this.ownedEl);
            this.ownedEl = null;
         }, widget.destroyDelay);
      }

      delete this.containerEl;
   }

   setZIndex(zIndex) {
      if (this.shadowEl)
         this.shadowEl.style.zIndex = zIndex;
      this.setCustomStyle({
         zIndex: zIndex
      });
   }

   setCustomStyle(style) {
      Object.assign(this.customStyle, style);
      if (this.el)
         Object.assign(this.el.style, this.customStyle);
   }

   getOverlayStyle() {
      var {data} = this.props.instance;
      return {
         ...data.style,
         ...this.customStyle
      }
   }

   setCSSState(mods) {
      var m = {...this.state.mods};
      var changed = false;
      for (var k in mods)
         if (m[k] !== mods[k]) {
            m[k] = mods[k];
            changed = true;
         }

      if (changed)
         this.setState({
            mods: mods
         });
   }

   getOverlayCssClass() {
      var {data, widget} = this.props.instance;
      var {CSS} = widget;

      return CSS.expand(data.classNames, CSS.state({
         ...this.state.mods,
         animated: this.state.animated && !this.unmounting
      }));
   }

   componentDidUpdate() {
      if (this.containerEl) {
         VDOM.DOM.render(this.renderOverlay(), this.containerEl);
      }
      var {widget} = this.props.instance;
      widget.overlayDidUpdate(this.props.instance, this);
      this.el.className = this.getOverlayCssClass();
      Object.assign(this.el.style, this.getOverlayStyle());
   }
}
