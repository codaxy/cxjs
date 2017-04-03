import {DocumentTitle, PureContainer, Content} from 'cx/widgets';
import {HtmlElement} from 'cx/widgets';
import {Layout} from './Layout';
import {Contents} from '../content/Contents';
import {ContentRouter} from '../content/ContentRouter';
import {Floater} from '../components/Floater';

export const Main = <cx>
    <PureContainer outerLayout={Layout}>
        <DocumentTitle text="Cx Docs"/>
        <Content name="aside" items={Contents}/>
        <ContentRouter />
        <Floater if:expr="{layout.touch}"/>
    </PureContainer>
</cx>;
