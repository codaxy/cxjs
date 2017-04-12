import {HtmlElement, Link, Section} from 'cx/widgets';

export default <cx>
   <h2 putInto="header">
      Home
   </h2>

   <Section mod="card" title="Welcome">
      <p>Your app is now running.</p>
      <p>Checklist:</p>
      <ul>
         <li><Link href="~/about">Routing</Link></li>
         <li class="green-item">CSS</li>
         <li>HMR</li>
      </ul>
   </Section>
</cx>
