import {Widget, VDOM} from '../Widget';
import {BoundedObject} from './BoundedObject';
import {Rect} from './util/Rect';
import {ResizeManager} from '../ResizeManager';

export class Svg extends BoundedObject {

   initState(context, instance) {
      var size = {
         width: 0,
         height: 0
      };
      instance.size = size;
      instance.state = {size};
   }

   explore(context, instance) {
      var {size} = context.options;
      if (size) {
         instance.size = size;
         instance.shouldUpdate = true;
         instance.setState({size});
      }
      super.explore(context, instance);
   }

   prepare(context, instance) {
      var size = instance.size;
      instance.parentRect = context.parentRect;
      context.parentRect = new Rect({
         l: 0,
         t: 0,
         r: size.width,
         b: size.height
      });
      super.prepare(context, instance);
      context.parentRect = instance.parentRect;
   }

   render(context, instance, key) {
      if (context.options.size)
         return this.renderChildren(context, instance);

      return <SvgComponent key={key} instance={instance} options={context.options}>
         {this.renderChildren(context, instance)}
      </SvgComponent>
   }

   cleanup(context, instance) {
      if (instance.size)
         super.cleanup(context, instance);

      if (context.options.size) {
         //invalidate cache if only inner content was rendered
         delete instance.cached.vdom;
      }
   }
}

Svg.prototype.pure = false;
Svg.prototype.anchors = '0 1 1 0';
Svg.prototype.baseClass = 'svg';

function sameSize(a, b) {
   if (!a || !b)
      return false;

   return a.width == b.width && a.height == b.height;
}

class SvgComponent extends VDOM.Component {

   constructor(props) {
      super(props);
      this.state = {
         size: props.instance.size
      };
   }

   render() {
      var {instance} = this.props;
      var {data, size} = instance;

      var children;
      if (size && sameSize(this.state.size, size))
         children = this.props.children;
      else if (this.state.size)
         children = Widget.renderInstance(instance, {size: this.state.size});

      return <svg ref={el=>{this.svg = el}} className={data.classNames} style={data.style}>
         {children}
      </svg>
   }

   shouldComponentUpdate(props) {
      return props.instance.shouldUpdate;
   }

   onResize() {
      var bounds = this.svg.getBoundingClientRect();
      var size = {
         width: bounds.width,
         height: bounds.height
      };
      if (!sameSize(this.state.size, size))
         this.setState({
            size: size
         });
   }

   componentDidMount() {
      this.offResize = ResizeManager.subscribe(::this.onResize);
      this.onResize();
   }

   componentDidUpdate() {
      this.onResize();
   }

   componentWillUnmount() {
      if (this.offResize) {
         this.offResize();
         delete this.offResize;
      }
   }
}

Widget.alias('svg', Svg);