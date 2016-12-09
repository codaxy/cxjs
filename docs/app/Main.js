import { DocumentTitle, PureContainer, Content } from 'cx/widgets';
import { HtmlElement } from 'cx/widgets';
import {Layout} from './Layout';
import {Contents} from '../content/Contents';
import {ContentRouter} from '../content/ContentRouter';

export const Main = <cx>
   <PureContainer outerLayout={Layout}>
      <DocumentTitle value="Cx" />
      <Content name="aside" items={Contents} />
      <ContentRouter />
   </PureContainer>
</cx>;
