import {HtmlElement, Link, Section} from 'cx/widgets';

export default <cx>
   <h2 putInto="header">
      About
   </h2>
   <Section mod="well">
      <p ws>
         This is an application generated using Cx CLI.
      </p>
      <p>Since you can see this page, routing seems to be working.</p>
      <p ws>
         Now you should definitely star Cx on <a href="https://github.com/codaxy/cxjs" target="_blank">GitHub</a>,
         if you haven't done so already.
      </p>
      <Link href="~/">Back</Link>
   </Section>
</cx>
