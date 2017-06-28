import {HtmlElement, cx, TextField} from 'cx/widgets';
import {VDOM} from 'cx/ui';


const Comp = cx(({value, children}) => <cx>
   <div>
      <TextField value={value}/>
      <TextField value={value}/>
      {children}
   </div>
</cx>);

//TODO
//const Comp = ({test, children}) => <cx><div>{test}{children}</div></cx>;

// const Comp2 = createFunctionalCompoent((x) => {
//
//    ewq
//
//    return <cx>
//       ew
//    </cx>
// })

const ReactComp = ({test, children}) => <div>{test}{children}</div>;

export default <cx>
   <Comp value:bind="X">
      Additional content
      <TextField value:bind="X" />
   </Comp>

   {/*<ReactComp test="Test">*/}
      {/*<strong>12321232</strong>*/}
   {/*</ReactComp>*/}
</cx>

