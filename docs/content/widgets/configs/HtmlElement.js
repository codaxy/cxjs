import {Md} from '../../../components/Md';
import classAndStyle from './classAndStyle';
import pureContainer from './PureContainer';

export default {
   ...classAndStyle,
   ...pureContainer,
   tag: {
      type: 'string',
      key: false,
      description: <cx><Md>
         Name of the HTML element to be rendered. Default is `div`.
      </Md></cx>
   },
   baseClass: {
      type: 'string',
      description: <cx><Md>
         Base CSS class to be applied on the element. No class is applied by default.
      </Md></cx>
   },
   innerHtml: {
      type: 'string',
      description: <cx><Md>
         HTML to be injected into the element.
      </Md></cx>
   },
   text: {
      type: 'string',
      description: <cx><Md>
         Inner text contents.
      </Md></cx>
   },
   tooltip: {
      type: 'string/object',
      description: <cx><Md>
         Tooltip configuration. For more info see [Tooltips](~/widgets/tooltips).
      </Md></cx>
   }
};
