import {HtmlElement} from 'cx/ui/HtmlElement';
import {Section} from 'shared/components/Section';

import Dashboard from './Dashboard';
import Pagination from './Pagination';
import FixedHeader from './FixedHeader';
import Grouping from './Grouping';

import {casual} from 'shared/data/casual';
import {Format} from 'cx/util/Format';
import plural from 'plural';

Format.registerFactory('plural', (format, text) => {
   return value => plural(text, value);
});

export default <cx>
   <div>
      <span putInto="breadcrumbs">Grids</span>

      <div class="flexrow phone">
         <Section title="Pagination" style="flex:1" mod="well">
            <Pagination />
         </Section>

         <Section title="Fixed Header" style="flex:1" mod="well">
            <FixedHeader />
         </Section>

         <Section title="Grouping" style="flex:1" mod="well">
            <Grouping />
         </Section>
      </div>

      <Section title="Grid Dashboard" mod="well">
         <Dashboard />
      </Section>
   </div>
</cx>;

