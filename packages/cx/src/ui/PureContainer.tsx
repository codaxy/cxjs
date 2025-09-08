import {Container} from './Container';

export class PureContainer extends Container {
    public isPureContainer: boolean = true;
}

PureContainer.alias('pure-container', PureContainer);
