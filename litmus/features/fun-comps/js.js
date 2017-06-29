import {HtmlElement, cx, TextField} from 'cx/widgets';
import {VDOM, createFunctionalComponent} from 'cx/ui';


const Comp = cx(({value, children}) => <cx>
   <div>
      <TextField value={value}/>
      <TextField value={value}/>
      {children}
   </div>
</cx>);

//TODO
const Comp2 = ({test, children}) => <cx>
   <div>{test}{children}</div>
</cx>;

const Comp3 = createFunctionalComponent((x) => {
   return <cx>
      <span>This works too...</span>
   </cx>
});

const ReactComp = ({test, children}) => <div>{test}{children}</div>;

export default <cx>
   <Comp value:bind="X">
      Additional content
      <TextField value:bind="X" />
   </Comp>

   <Comp2 test="simple">
      Children
      <TextField value={"it works"} />
   </Comp2>

   <Comp3 />

   <ReactComp test="Test">
      <strong>12321232</strong>
   </ReactComp>
</cx>

