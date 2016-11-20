import {Widget, VDOM, getContent} from 'cx/ui/Widget';
import {PureContainer} from 'cx/ui/PureContainer';

export class FlexBox extends PureContainer {

   prepareCSS(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         distance: this.distance,
         align: this.align,
         center: this.center,
         wrap: this.wrap,
         [this.target]: true,
         [this.direction]: true
      };
      super.prepareCSS(context, instance);
   }

   render(context, instance, key) {
      let {data} = instance;
      return <div key={key} className={data.classNames} style={data.style}>
         {this.renderChildren(context, instance)}
      </div>
   }
}

FlexBox.prototype.baseClass = "flexbox";
FlexBox.prototype.styled = true;
FlexBox.prototype.direction = 'row';
FlexBox.prototype.distance = false;
FlexBox.prototype.wrap = false;
FlexBox.prototype.align = false;
FlexBox.prototype.center = false;
FlexBox.prototype.target = 'any';

export class FlexRow extends FlexBox {}

export class FlexCol extends FlexBox {}

FlexCol.prototype.direction = 'column';