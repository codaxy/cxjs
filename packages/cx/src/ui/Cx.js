import {Widget, VDOM, getContent} from './Widget';
import {Instance} from './Instance';
import {RenderingContext} from './RenderingContext';
import {debug, appDataFlag} from '../util/Debug';
import {Timing, now, appLoopFlag, vdomRenderFlag} from '../util/Timing';
import {isBatchingUpdates, notifyBatchedUpdateStarting, notifyBatchedUpdateCompleted} from './batchUpdates';
import {shallowEquals} from "../util/shallowEquals";
import {PureContainer} from "./PureContainer";

export class Cx extends VDOM.Component {
   constructor(props) {
      super(props);

      if (props.instance) {
         this.widget = props.instance.widget;
         this.store = props.instance.store;
      }
      else {
         this.widget = PureContainer.create({ items: props.widget || props.items });

         if (props.parentInstance) {
            this.parentInstance = props.parentInstance;
            this.store = props.store || this.parentInstance.store;
         }
         else {
            this.parentInstance = new Instance(this.widget, 0);
            this.store = props.store;
         }

         if (!this.store)
            throw new Error('Cx component requires store.');
      }

      if (props.subscribe) {
         this.unsubscribe = this.store.subscribe(::this.update);
         this.state = {data: this.store.getData()};
      }

      this.flags = {};
      this.renderCount = 0;
   }

   componentWillReceiveProps(props) {
      //TODO: Switch to new props
      if (props.subscribe) {
         let data = this.store.getData();
         if (data !== this.state.data)
            this.setState({data: this.store.getData()});
      }
   }

   getInstance() {
      if (this.props.instance)
         return this.props.instance;

      if (this.instance)
         return this.instance;

      if (this.widget && this.parentInstance)
         return this.instance = this.parentInstance.getDetachedChild(this.widget, 0, this.store);

      throw new Error("Could not resolve a widget instance in the Cx component.");
   }

   render() {
      if (!this.widget)
         return null;

      return <CxContext
         instance={this.getInstance()}
         flags={this.flags}
         options={this.props.options}
         buster={++this.renderCount}
         contentFactory={this.props.contentFactory}
      />
   }

   componentDidMount() {
      this.componentDidUpdate();

      if (this.props.options && this.props.options.onPipeUpdate)
         this.props.options.onPipeUpdate(::this.update);
   }

   componentDidUpdate() {
      if (this.flags.dirty) {
         this.update();
      }
   }

   update() {
      let data = this.store.getData();
      debug(appDataFlag, data);
      if (this.flags.preparing)
         this.flags.dirty = true;
      else if (isBatchingUpdates() || this.props.immediate) {
         notifyBatchedUpdateStarting();
         this.setState({data: data}, notifyBatchedUpdateCompleted);
      } else {
         //in standard mode sequential store commands are batched
         if (!this.pendingUpdateTimer) {
            notifyBatchedUpdateStarting();
            this.pendingUpdateTimer = setTimeout(() => {
               delete this.pendingUpdateTimer;
               this.setState({data: data}, notifyBatchedUpdateCompleted);
            }, 0);
         }
      }
   }

   componentWillUnmount() {
      if (this.pendingUpdateTimer)
         clearTimeout(this.pendingUpdateTimer);
      if (this.unsubscribe)
         this.unsubscribe();
      if (this.props.options && this.props.options.onPipeUpdate)
         this.props.options.onPipeUpdate(null);
   }

   shouldComponentUpdate(props, state) {
      return state !== this.state
         || !props.params
         || !shallowEquals(props.params, this.props.params)
         || props.instance !== this.props.instance
         || props.widget !== this.props.widget
         || props.store !== this.props.store
         || props.parentInstance !== this.props.parentInstance
         ;
   }
}


class CxContext extends VDOM.Component {

   constructor(props) {
      super(props);
      this.renderCount = 0;
      this.componentWillReceiveProps(props);
   }

   componentWillReceiveProps(props) {
      this.timings = {
         start: now()
      };

      let {instance, options, contentFactory} = props;
      let count = 0, visible, context;

      //should not be tracked by parents for destroy
      if (!instance.detached)
         throw new Error("The instance passed to a Cx component should be detached from its parent.");

      if (this.props.instance !== instance && this.props.instance.destroyTracked)
         this.props.instance.destroy();

      this.props.flags.preparing = true;

      do {
         context = new RenderingContext(options);
         this.props.flags.dirty = false;
         visible = instance.scheduleExploreIfVisible(context);
         if (visible) {
            while (context.exploreStack.length > 0) {
               let inst = context.exploreStack.pop();
               inst.explore(context);
            }
         }
         else if (instance.destroyTracked) {
            instance.destroy();
            break;
         }
      }
      while (this.props.flags.dirty && ++count <= 3 && Widget.optimizePrepare);

      if (visible) {

         this.timings.afterExplore = now();

         for (let i = 0; i < context.prepareList.length; i++)
            context.prepareList[i].prepare(context);
         this.timings.afterPrepare = now();

         //console.log(context.prepareList);
         //console.log(context.renderStack);

         //walk in reverse order so children get rendered first
         let renderLists = context.getRenderLists();
         for (let j = 0; j < renderLists.length; j++) {
            for (let i = renderLists[j].length - 1; i >= 0; i--) {
               renderLists[j][i].render(context);
            }
         }

         this.content = getContent(instance.vdom);
         if (contentFactory)
            this.content = contentFactory({children: this.content});
         this.timings.afterRender = now();
         for (let i = 0; i < context.cleanupList.length; i++)
            context.cleanupList[i].cleanup(context);
      }
      else {
         this.content = null;
         this.timings.afterExplore = this.timings.afterPrepare = this.timings.afterRender = now();
      }

      this.timings.beforeVDOMRender = now();
      this.props.flags.preparing = false;
      this.props.flags.rendering = true;
      this.renderingContext = context;
   }

   render() {
      return this.content;
   }

   componentDidMount() {
      this.componentDidUpdate();
   }

   componentDidUpdate() {
      this.props.flags.rendering = false;
      this.timings.afterVDOMRender = now();

      //let {instance} = this.props;
      //instance.cleanup(this.renderingContext);

      this.timings.afterCleanup = now();
      this.renderCount++;

      if (process.env.NODE_ENV !== "production") {

         let {start, beforeVDOMRender, afterVDOMRender, afterPrepare, afterExplore, afterRender, afterCleanup} = this.timings;

         Timing.log(
            vdomRenderFlag,
            this.renderCount,
            'cx', (beforeVDOMRender - start + afterCleanup - afterVDOMRender).toFixed(2) + 'ms',
            'vdom', (afterVDOMRender - beforeVDOMRender).toFixed(2) + 'ms'
         );

         Timing.log(
            appLoopFlag,
            this.renderCount,
            this.renderingContext.options.name || 'main',
            'total', (afterCleanup - start).toFixed(1) + 'ms',
            'explore', (afterExplore - start).toFixed(1) + 'ms',
            'prepare', (afterPrepare - afterExplore).toFixed(1),
            'render', (afterRender - afterPrepare).toFixed(1),
            'vdom', (afterVDOMRender - beforeVDOMRender).toFixed(1),
            'cleanup', (afterCleanup - afterVDOMRender).toFixed(1)
         );
      }
   }

   componentWillUnmount() {
      let {instance} = this.props;
      if (instance.destroyTracked)
         instance.destroy();
   }
}
