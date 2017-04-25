import {VDOM} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';

export class FlexBox extends PureContainer {

   init() {
      if (this.pad === true)
         this.pad = 'medium';

      if (this.hpad === true)
         this.hpad = 'medium';

      if (this.vpad === true)
         this.vpad = 'medium';

      if (this.spacing === true)
         this.spacing = 'medium';

      if (this.hspacing === true)
         this.hspacing = 'medium';

      if (this.vspacing === true)
         this.vspacing = 'medium';

      super.init();
   }

   initInstance(context, instance) {
      instance.eventHandlers = instance.getJsxEventProps();
      super.initInstance(context, instance);
   }

   prepareCSS(context, instance) {
      let {data} = instance;
      data.stateMods = {
         ...data.stateMods,
         [this.pad + '-pad']: this.pad,
         [this.hpad + '-hpad']: this.hpad,
         [this.vpad + '-vpad']: this.vpad
      };
      super.prepareCSS(context, instance);
   }

   render(context, instance, key) {
      let {data, eventHandlers} = instance;
      let {CSS, baseClass} = this;
      let flexboxMods = {
         [this.spacing + '-spacing']: this.spacing,
         [this.hspacing + '-hspacing']: this.hspacing,
         [this.vspacing + '-vspacing']: this.vspacing,
         ['align-' + this.align]: this.align,
         ['justify-' + this.justify]: this.justify,
         wrap: this.wrap,
         ['target-' + this.target]: true,
         [this.direction]: true
      };

      return <div key={key} className={data.classNames} style={data.style} {...eventHandlers}>
         <div className={CSS.element(baseClass, 'flexbox', flexboxMods)}>
            {this.renderChildren(context, instance)}
         </div>
      </div>
   }
}

FlexBox.prototype.baseClass = "flexbox";
FlexBox.prototype.styled = true;
FlexBox.prototype.direction = 'row';
FlexBox.prototype.spacing = false;
FlexBox.prototype.hspacing = false;
FlexBox.prototype.vspacing = false;
FlexBox.prototype.pad = false;
FlexBox.prototype.hpad = false;
FlexBox.prototype.vpad = false;
FlexBox.prototype.wrap = false;
FlexBox.prototype.align = false;
FlexBox.prototype.justify = false;
FlexBox.prototype.target = 'any';

export class FlexRow extends FlexBox {}

export class FlexCol extends FlexBox {}
FlexCol.prototype.direction = 'column';