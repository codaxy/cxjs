import { Window, TextField, Checkbox, Button, Section, FlexCol } from 'cx/widgets';
import { LabelsLeftLayout } from 'cx/ui';

export default <cx>
   <Window
      visible={{
         bind: "$page.login.visible",
         defaultValue: false
      }}
      title="Login"
      center
      modal
      style="min-width: 300px;"
   >
      <Section>
         <FlexCol>
            <TextField label="Username" value:bind="$page.login.username" required style="width:100%;"/>
            <TextField label="Password" inputType="password" value:bind="$page.login.password" style="width:100%;" required/>
            <Checkbox value:bind="$page.login.rememberMe" style="margin: 20px 0;">Remember Me</Checkbox>
            <Button mod="primary"  style="align-self: flex-end;" mod="flat-primary">Login</Button>
         </FlexCol>         
      </Section>
   </Window>
</cx>
