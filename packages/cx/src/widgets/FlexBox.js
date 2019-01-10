import {VDOM} from '../ui/Widget';
import {Container} from '../ui/Container';
import {isUndefined} from '../util/isUndefined';

export class FlexBox extends Container {

   init() {
      if (this.padding)
         this.pad = this.padding;
      
      if (this.hpadding)
         this.hpad = this.hpadding;

      if (this.vpadding)
         this.vpad = this.vpadding;

      this.hpad = isUndefined(this.hpad) ? this.pad : this.hpad;
      this.vpad = isUndefined(this.vpad) ? this.pad : this.hpad;

      if (this.hpad === true)
         this.hpad = 'medium';

      if (this.vpad === true)
         this.vpad = 'medium';
      
      this.hspacing = isUndefined(this.hspacing) ? this.spacing : this.hspacing;
      this.vspacing = isUndefined(this.vspacing) ? this.spacing : this.vspacing;

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
         [this.hpad + '-hpad']: this.hpad,
         [this.vpad + '-vpad']: this.vpad,
         nested: this.nested
      };
      super.prepareCSS(context, instance);
   }

   render(context, instance, key) {
      let {data, eventHandlers} = instance;
      let {CSS, baseClass} = this;
      let flexboxMods = {
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
FlexBox.prototype.hspacing = undefined;
FlexBox.prototype.vspacing = undefined;
FlexBox.prototype.pad = false;
FlexBox.prototype.hpad = undefined;
FlexBox.prototype.vpad = undefined;
FlexBox.prototype.wrap = false;
FlexBox.prototype.align = false;
FlexBox.prototype.justify = false;
FlexBox.prototype.target = 'any';
FlexBox.prototype.nested = false;

export class FlexRow extends FlexBox {}

export class FlexCol extends FlexBox {}
FlexCol.prototype.direction = 'column';