/*
   HoverSync transfers through the context methods for reporting and subscribing to hover data to
   its descendants. How this should work is that each component can subscribe and unsubscribe
   to a hover channel and receive info about hover changes.
   Also, each component should report mouse enter/leave events.
   Similar to controllers, hover sync should transcend into child contexts.
*/

import { dummyCallback } from "../util/dummyCallback";
import { parseStyle } from "../util/parseStyle";
import { SubscriberList } from "../util/SubscriberList";
import { Container } from "./Container";
import { PureContainer } from "./PureContainer";
import { VDOM } from "./VDOM";

export class HoverSync extends PureContainer {
   initInstance(context, instance) {
      let channels = {};
      instance.hoverSync = {
         report: (channel, hoverId, active) => {
            let ch = channels[channel];
            if (!ch) return;
            let state = active && hoverId;
            if (ch.state !== state && (ch.state === hoverId || active)) {
               ch.state = state;
               ch.subscribers.notify(state);
            }
         },
         subscribe: (channel, callback) => {
            let ch = channels[channel];
            if (!ch)
               ch = channels[channel] = {
                  subscribers: new SubscriberList(),
                  state: false,
               };
            return ch.subscribers.subscribe(callback);
         },
      };
   }

   explore(context, instance) {
      context.push("hoverSync", instance.hoverSync);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop("hoverSync");
   }
}

class HoverSyncChild extends VDOM.Component {
   constructor(props) {
      super(props);
      this.state = { hover: false };
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
   }

   onMouseMove() {
      this.props.hoverSync.report(this.props.hoverChannel, this.props.hoverId, true);
   }

   onMouseLeave() {
      this.props.hoverSync.report(this.props.hoverChannel, this.props.hoverId, false);
   }

   compontentWillUnmount() {
      this.unsubscribe();
   }

   componentDidMount() {
      this.unsubscribe = this.props.hoverSync.subscribe(this.props.hoverChannel, (hoverId) => {
         let hover = hoverId === this.props.hoverId;
         if (hover !== this.state.hover) this.setState({ hover });
      });
   }

   render() {
      return this.props.render({
         hover: this.state.hover,
         onMouseLeave: this.onMouseLeave,
         onMouseMove: this.onMouseMove,
         key: "child"
      });
   }
}

export function withHoverSync(key, hoverSync, hoverChannel, hoverId, render) {
   if (!hoverSync || !hoverChannel || hoverId == null)
      return render({ key, hover: false, onMouseLeave: dummyCallback, onMouseMove: dummyCallback });
   return (
      <HoverSyncChild key={key} hoverSync={hoverSync} hoverChannel={hoverChannel} hoverId={hoverId} render={render} />
   );
}

export class HoverSyncElement extends Container {

   declareData(...args) {
      super.declareData(...args, {
         hoverId: undefined,
         hoverClass: { structured: true },
         hoverStyle: { structured: true },
      })
   }

   prepareData(context, instance) {
      instance.hoverSync = context.hoverSync;
      instance.inSvg = !!context.parentRect;
      let { data } = instance;
      data.hoverStyle = parseStyle(data.hoverStyle);
      super.prepareData(context, instance);
   }

   render(context, instance, key) {
      let { data, inSvg } = instance;
      let { CSS } = this;
      let children = this.renderChildren(context, instance);
      let eventHandlers = instance.getJsxEventProps();
      return withHoverSync(
         key,
         instance.hoverSync,
         this.hoverChannel,
         data.hoverId,
         ({ hover, onMouseMove, onMouseLeave, key }) => {
            let style =
            {
               ...data.style,
               ...(hover && data.hoverStyle)
            }
            return VDOM.createElement(inSvg ? 'g' : 'div', {
               key,
               className: CSS.expand(data.classNames, CSS.state({ hover }), hover && data.hoverClass),
               style,
               ...eventHandlers,
               onMouseLeave,
               onMouseMove,
            }, children);
         }
      );
   }
}

HoverSyncElement.prototype.baseClass = "hoversyncelement";
HoverSyncElement.prototype.styled = true;
HoverSyncElement.prototype.hoverChannel = "default";