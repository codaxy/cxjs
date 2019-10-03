import {Button, TextField, ValidationGroup} from "cx/widgets";

const emailValidationRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/ig;

export default <cx>
   <div>
      <ValidationGroup invalid-bind="invalid">
         <TextField
            value-bind="test"
            validationRegExp={emailValidationRegex} required validationMode="help-block"/>
      </ValidationGroup>
      <Button disabled-bind="invalid">Send</Button>
   </div>
</cx>