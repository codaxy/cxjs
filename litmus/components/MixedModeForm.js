import { Widget, VDOM } from 'cx/ui';
import { Cx, TextField, HtmlElement } from 'cx/widgets';

export class MixedModeForm extends Widget
{
   render(context, instance, key) {
      return <div key={key} >
          <h3>Mixed Mode Form</h3>
          <Cx parentInstance={instance}>
             <div>
                <TextField value:bind="test" />
                <TextField value:bind="test" />
             </div>
          </Cx>
      </div>;
   }
}

MixedModeForm.prototype.memoize = false;
