import { Widget, VDOM } from 'cx/ui/Widget';
import { Cx } from 'cx/ui/Cx';
import { TextField } from 'cx/ui/form/TextField';
import { HtmlElement } from 'cx/ui/HtmlElement';

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
