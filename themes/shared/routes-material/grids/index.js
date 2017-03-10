import { HtmlElement, Section, FlexRow } from 'cx/widgets';
import { Format } from 'cx/util';

import Dashboard from './Dashboard';
import Pagination from './Pagination';
import FixedHeader from './FixedHeader';
import Grouping from './Grouping';

import {casual} from 'shared/data/casual';
import plural from 'plural';

Format.registerFactory('plural', (format, text) => {
   return value => plural(text, value);
});

export default <cx>
   <div>
      <span putInto="breadcrumbs">Grids</span>

      <FlexRow pad spacing wrap target="desktop">
         <Section title="Pagination" style="flex:1" mod="card">
            <Pagination />
         </Section>

         <Section title="Fixed Header" style="flex:1" mod="card">
            <FixedHeader />
         </Section>

         <Section title="Grouping" style="flex:1" mod="card">
            <Grouping />
         </Section>

         <Section title="Grid Dashboard" style="flex:2" mod="card" >
            <Dashboard />
         </Section>
      </FlexRow>
   </div>
</cx>;

