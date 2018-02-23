import { TextField } from 'cx/widgets';
import {createFunctionalComponent, PureContainer} from 'cx/ui';

const SuperText = createFunctionalComponent(({...props}) => {

   console.log('inside func. component -------', props);

   return (
      <cx>
         <PureContainer>
            <TextField {...props} value-bind="value" placeholder="Default" label="Default" />
            <br/>
            {props.children}
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
         help= "Standard help"
         //{...props}
      >
         <TextField {...props} value-bind="value" />
      </SuperText>
   </cx>
);