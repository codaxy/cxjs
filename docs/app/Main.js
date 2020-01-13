import {DocumentTitle, PureContainer, Content} from 'cx/widgets';
import {HtmlElement} from 'cx/widgets';
import {Layout} from './Layout';
import {Contents} from '../content/Contents';
import {ContentRouter} from '../content/ContentRouter';
import {Floater} from '../components/Floater';
import { MasterLayout } from '../../misc/layout';

export const Main = <cx>
    <PureContainer outerLayout={MasterLayout}>
        <DocumentTitle text="Cx Docs"/>
        <Content name="aside" items={Contents}/>
        <ContentRouter />
        <Floater if-expr="{layout.touch}"/>
    </PureContainer>
</cx>;
