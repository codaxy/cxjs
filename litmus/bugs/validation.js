import {Button, TextField, ValidationGroup, Checkbox} from "cx/widgets";

const emailValidationRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/ig;

export default <cx>
   <div>
      <ValidationGroup invalid-bind="invalid">
         <Checkbox value={{ bind: "visible", defaultValue: true }}>Visible</Checkbox>
         <TextField
            visible-bind="visible"
            value-bind="test"
            validationRegExp={emailValidationRegex} required validationMode="help-block"/>
      </ValidationGroup>
      <Button disabled-bind="invalid">Send</Button>
   </div>
</cx>