import {cx, react, Button, Section, FlexRow, TextField} from 'cx/widgets';

const Comp = cx(({title, value, children}) => (
    <div>
        <h4>{title}</h4>
        <TextField value={value}/>
        {children}
    </div>
));

//not possible to use Cx components inside
const ReactComp = ({title, children}) => react(
    <div>
        <h4>{title}</h4>
        {children}
    </div>
);

export default <cx>
    <Comp title="Cx Functional Component" value={{bind: 'x'}} visible={true}>
        <p>1232</p>
        <TextField value={{bind:"x"}} />
    </Comp>

    <ReactComp title="React Functional Component" visible={true}>
        <p>12321232</p>
        <TextField value={{bind:"x"}} />
    </ReactComp>
</cx>

