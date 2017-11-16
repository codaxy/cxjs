import {Container} from './Container';

export class PureContainer extends Container {}

PureContainer.prototype.isPureContainer = true;

PureContainer.alias('pure-container', PureContainer);
