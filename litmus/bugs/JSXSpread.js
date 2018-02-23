import { TextField } from 'cx/widgets';
import {createFunctionalComponent, PureContainer} from 'cx/ui';

const SuperText = createFunctionalComponent(({children, ...props}) => {

   console.log('inside func. component -------', props);

   return (
      <cx>
         <PureContainer>
            <TextField {...props} value-bind="value" placeholder="Default" label="Default" />
            <br/>
            {children}
         </PureContainer>
      </cx>
   )
});

let props = {
   label: "Spread",
   placeholder: "Spread"
}

export default (
   <cx>
      <SuperText 
         // label="Standard"
         // placeholder="Standard"
         // {...props} 
         {...{
            label: "Standard",
            placeholder: "Standard"
         }} 
      >
         <TextField {...props} value-bind="value" />
      </SuperText>
   </cx>
);