import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';
import {Layout} from './Layout';
import {Contents} from '../content/Contents';
import {ContentRouter} from '../content/ContentRouter';
import {DocumentTitle} from 'cx/ui/DocumentTitle';
import {PureContainer} from 'cx/ui/PureContainer';

export const Main = <cx>
   <PureContainer outerLayout={Layout}>
      <DocumentTitle value="Cx" />
      <Content name="aside" items={Contents} />
      <ContentRouter />
   </PureContainer>
</cx>;
