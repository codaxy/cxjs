import { Window, TextField, Checkbox, Button, Section } from 'cx/widgets';
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
   >
      <Section layout={LabelsLeftLayout}>
         <TextField label="Username" value:bind="$page.login.username" required/>
         <TextField label="Password" inputType="password" value:bind="$page.login.password"/>
         <Checkbox value:bind="$page.login.rememberMe">Remember Me</Checkbox>
         <Button mod="primary">Login</Button>
      </Section>
   </Window>
</cx>
