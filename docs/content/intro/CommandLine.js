import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {Content} from 'cx/ui/layout/Content';

import {CodeSnippet} from '../../components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Todo} from '../examples/todo/Todo';
import {Tab} from 'cx/ui/nav/Tab';

export const CommandLine = <cx>
    <Md>
        # Cx Command Line Interface
        
        Cx requires tools such as babel and webpack which are plugin-based and require a 
        significant amount of work to configure properly.
        Normally, when starting a new project, you wouldn't go through all of that setup 
        every single time, but rather use some kind of boilerplate project that contains the 
        basic file structure as well as all required tools and configuration code. 
        
        We created one such project and put it inside the 
        [Cx command line tool](https://www.npmjs.com/package/cx-cli). This 
        tool helps you start and evolve your application — it is the quickest way for setting 
        things up.

        ## Usage

        Provided that you have Node.js and npm installed, you can use your favorite command line
        tool to quickly set up a new Cx project. 

        If you haven't done so already, inside the project folder initialize the package.json
        file by running the command `npm init`.

        Install cx-cli tool:

        `npm i cx-cli [--global]`
        
        For new projects, use scaffold to create basic app structure.

        `cx scaffold [--yarn]`

        Append --yarn to use yarn package manager to install packages.

        Alternatively, use install to add packages into an existing project structure:

        `cx install [--yarn]`
        Please note that this will add cx, react, babel and sass related packages.

        Start your application using:

        `cx start`
        
        Make a production build:

        `cx build`

   </Md>
</cx>
