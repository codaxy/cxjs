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
   initInstance(context: any, instance: any) {
      let channels: any = {};
      instance.hoverSync = {
         report: (channel: string, hoverId: any, active: boolean) => {
            let ch = channels[channel];
            if (!ch) return;
            let state = active && hoverId != null;
            if (ch.state !== state && (ch.state === hoverId || active)) {
               ch.state = state;
               ch.subscribers.notify(state);
            }
         },
         subscribe: (channel: string, callback: (state: any) => void) => {
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

   explore(context: any, instance: any) {
      context.push("hoverSync", instance.hoverSync);
      super.explore(context, instance);
   }

   exploreCleanup(context: any, instance: any) {
      context.pop("hoverSync");
   }
}

interface HoverSyncChildProps {
   hoverSync: any;
   hoverChannel: string;
   hoverId: any;
   render: (props: any) => any;
}

interface HoverSyncChildState {
   hover: boolean;
}

class HoverSyncChild extends VDOM.Component<HoverSyncChildProps, HoverSyncChildState> {
   unsubscribe: any;

   constructor(props: HoverSyncChildProps) {
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
      this.unsubscribe = this.props.hoverSync.subscribe(this.props.hoverChannel, (hoverId: any) => {
         let hover = hoverId === this.props.hoverId;
         if (hover !== this.state.hover) this.setState({ hover });
      });
   }

   render() {
      return this.props.render({
         hover: this.state.hover,
         onMouseLeave: this.onMouseLeave,
         onMouseMove: this.onMouseMove,
         key: "child",
      });
   }
}

export function withHoverSync(
   key: string,
   hoverSync: any,
   hoverChannel: string,
   hoverId: any,
   render: (props: any) => any,
) {
   if (!hoverSync || !hoverChannel || hoverId == null)
      return render({ key, hover: false, onMouseLeave: dummyCallback, onMouseMove: dummyCallback });
   return (
      <HoverSyncChild key={key} hoverSync={hoverSync} hoverChannel={hoverChannel} hoverId={hoverId} render={render} />
   );
}

export class HoverSyncElement extends Container {
   hoverChannel: string;
   baseClass: string;
   styled: boolean;

   declareData(...args: any[]) {
      super.declareData(...args, {
         hoverId: undefined,
         hoverClass: { structured: true },
         hoverStyle: { structured: true },
      });
   }

   prepareData(context: any, instance: any) {
      instance.hoverSync = context.hoverSync;
      instance.inSvg = !!context.inSvg;
      let { data } = instance;
      data.hoverStyle = parseStyle(data.hoverStyle);
      super.prepareData(context, instance);
   }

   render(context: any, instance: any, key: string) {
      let { data, inSvg } = instance;
      let { CSS } = this;
      let children = this.renderChildren(context, instance);
      let eventHandlers = instance.getJsxEventProps();
      return withHoverSync(
         key,
         instance.hoverSync,
         this.hoverChannel,
         data.hoverId,
         ({ hover, onMouseMove, onMouseLeave, key }: any) => {
            let style = {
               ...data.style,
               ...(hover && data.hoverStyle),
            };
            return VDOM.createElement(
               inSvg ? "g" : "div",
               {
                  key,
                  className: CSS.expand(data.classNames, CSS.state({ hover }), hover && data.hoverClass),
                  style,
                  ...eventHandlers,
                  onMouseLeave,
                  onMouseMove,
               },
               children,
            );
         },
      );
   }
}

HoverSyncElement.prototype.baseClass = "hoversyncelement";
HoverSyncElement.prototype.styled = true;
HoverSyncElement.prototype.hoverChannel = "default";
