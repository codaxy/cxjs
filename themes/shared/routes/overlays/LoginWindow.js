import {Window} from 'cx/ui/overlay/Window';
import {TextField} from 'cx/ui/form/TextField';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {LabelsLeftLayout} from 'cx/ui/layout/LabelsLeftLayout';
import {Section} from 'cx/ui/Section';
import {Button} from 'cx/ui/Button';

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
