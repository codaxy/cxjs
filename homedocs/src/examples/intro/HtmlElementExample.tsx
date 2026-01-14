import { createAccessorModelProxy } from "cx/data";
import { tpl } from "cx/ui";
import { HtmlElement, TextField } from "cx/widgets";

interface Model {
  name: string;
}

const m = createAccessorModelProxy<Model>();

// @model
export const model = {
  name: "World",
};
// @model-end

// @index
export default () => (
  <div>
    <h4 class="font-bold text-2xl">Heading</h4>
    <p>Paragraph with some text.</p>
    <HtmlElement tag="span">Using HtmlElement directly</HtmlElement>
    <hr />
    <TextField value={m.name} label="Name" />
    <p text={tpl(m.name, "Hello, {0|Stranger}!")} />
  </div>
);
// @index-end
