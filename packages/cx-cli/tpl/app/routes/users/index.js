import { Route } from "cx/widgets";

import List from "./List";
import Editor from "./Editor";

export default (
    <cx>
        <Route route="~/users" url-bind="url">
            <List />
        </Route>
        <Route route="~/users/:userId" url-bind="url">
            <Editor />
        </Route>
    </cx>
);
