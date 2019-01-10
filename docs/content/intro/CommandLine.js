import {Content} from 'cx/ui';
import {HtmlElement, Tab} from 'cx/widgets';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';


export const CommandLine = <cx>
    <Md>
        # Command Line Interface

        <CodeSplit>

            CxJS requires plugin-based tools such as [Babel](https://babeljs.io) and [webpack](https://webpack.js.org)
            which take a significant amount of time to be configured properly. Generally, when starting a new project,
            the developer would not go through the same setup every time. It is easier to start by copying
            a boilerplate project that contains the basic project structure which has all of the required tools and
            configuration files.

            The quickest way to set up a new CxJS project is by using the [Cx Command Line
            Tool](https://www.npmjs.com/package/cx-cli).

            ## Usage

            Once you have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed, you can use
            any terminal tool to quickly set up a new CxJS project.

            Install the `cx-cli` tool:

            `npm install cx-cli --global`

            Make sure you initialize the `package.json` file inside the project folder by running the
            `npm init` command.

            For new projects, use the scaffold command to copy the default project template.

            `cx scaffold [--yarn]`

            Append `--yarn` to use the [yarn](https://yarnpkg.com) package manager for installing packages instead of npm.

            Alternatively, use the install command to add packages into an existing project structure:

            `cx install [--yarn]`

            Please note that this will add CxJS, React, Babel, and Sass related packages to your project.

            Start your application using:

            `cx start`

            To make a production build, run:

            `cx build`

            To create a new route folder, run:

            `cx add route &lt;route_name&gt;`

            This command will create a new folder - `app/routes/route_name` and also create default `index.js`,
            `index.scss`, and `controller.js` files.

            <CodeSnippet putInto="code">{`
                // Create a new app

                md my-cx-app
                cd my-cx-app

                npm init -y
                npm install cx-cli --global

                cx scaffold
                cx start
                
                // Set up a new route folder
                cx add route route_name
            `}</CodeSnippet>
        </CodeSplit>
    </Md>
</cx>
