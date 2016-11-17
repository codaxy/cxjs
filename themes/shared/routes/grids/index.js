import {HtmlElement} from 'cx/ui/HtmlElement';
import {Section} from 'shared/components/Section';
import {FlexRow} from 'shared/components/FlexBox';

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

      <FlexRow distance wrap>
         <Section title="Pagination" style="flex:1" mod="well">
            <Pagination />
         </Section>

         <Section title="Fixed Header" style="flex:1" mod="well">
            <FixedHeader />
         </Section>

         <Section title="Grouping" style="flex:1" mod="well">
            <Grouping />
         </Section>

         <Section title="Grid Dashboard" mod="well" style="flex:2" >
            <Dashboard />
         </Section>
      </FlexRow>
   </div>
</cx>;

