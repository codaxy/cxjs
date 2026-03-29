import { Md } from "../../../components/Md";

export default {
    bind: {
        key: true,
        type: "string",
        description: <cx><Md>
            Prefix path to be used for data binding. Defaults to `$page`.
        </Md></cx>
    },
    data: {
        key: true,
        type: "object",
        description: <cx><Md>
            Outside data that will be carried into this scope.
        </Md></cx>
    },
    rootName: {
        type: "string",
        alias: "rootAlias",
        description: <cx><Md>
            Alias used to expose root data. Defaults to `$root`.
        </Md></cx>
    }
}