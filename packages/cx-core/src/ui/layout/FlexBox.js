import {VDOM} from '../Widget';
import {PureContainer} from '../PureContainer';

export class FlexBox extends PureContainer {

   prepareCSS(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         pad: this.pad,
         spacing: this.spacing,
         ['align-' + this.align]: this.align,
         ['justify-' + this.justify]: this.justify,
         wrap: this.wrap,
         ['target-' + this.target]: true,
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
FlexBox.prototype.spacing = false;
FlexBox.prototype.pad = false;
FlexBox.prototype.wrap = false;
FlexBox.prototype.align = false;
FlexBox.prototype.justify = false;
FlexBox.prototype.align = false;
FlexBox.prototype.target = 'any';

export class FlexRow extends FlexBox {}

export class FlexCol extends FlexBox {}
FlexCol.prototype.direction = 'column';