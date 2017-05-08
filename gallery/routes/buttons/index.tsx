import {cx, Button, Section} from 'cx/widgets';

export default <cx>
   <h2 putInto="header">
      Button
   </h2>
   <Section mod="well">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
   </Section>
</cx>
