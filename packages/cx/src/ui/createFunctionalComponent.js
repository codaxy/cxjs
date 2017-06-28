import {PureContainer} from './PureContainer';
import {createComponentFactory} from './Component';

export function createFunctionalComponent(factory) {
   return createComponentFactory(config => ({
      ...config,
      $type: PureContainer,
      items: factory(config)
   }));
}
