import {Widget, VDOM} from 'cx-core/src/ui/Widget';
import {HtmlElement} from 'cx-core/src/ui/HtmlElement';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@Widget.register('css-transition-group')
export class CSSTransitionGroup extends HtmlElement {
   attachProps(context, instance, props) {
      props.component = this.firstChild ? FirstChild : this.component;
      props.transitionName = this.transitionName;
      props.transitionAppear = this.transitionAppear;
      props.transitionEnter = this.transitionEnter;
      props.transitionLeave = this.transitionLeave;
      props.transitionAppearTimeout = this.transitionAppearTimeout;
      props.transitionEnterTimeout = this.transitionEnterTimeout;
      props.transitionLeaveTimeout = this.transitionLeaveTimeout;
   }

   isValidHtmlAttribute(attr) {
      if (!super.isValidHtmlAttribute(attr))
         return false;

      if (attr.indexOf('transition') == 0 || attr == "component")
         return false;

      return attr;
   }
}

CSSTransitionGroup.prototype.tag = ReactCSSTransitionGroup;
CSSTransitionGroup.prototype.transitionEnterTimeout = 300;
CSSTransitionGroup.prototype.transitionAppearTimeout = 300;
CSSTransitionGroup.prototype.transitionLeaveTimeout = 300;
CSSTransitionGroup.prototype.firstChild = false;

class FirstChild extends VDOM.Component {
   render() {
      var firstChild = this.props.children && this.props.children[0]
      return firstChild || null;
   }
}