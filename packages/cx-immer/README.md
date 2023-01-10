# cx-immer

This package allows simple integration of [Immer](https://immerjs.github.io/immer/) into [CxJS](https://cxjs.io) stores.

```js
import { enableImmerMutate } from "cx-immer";

enableImmerMutate();

...

store.mutate("item", item => {
    item.description = "Look, properties can be freely mutated without cloning parent objects first.".
});

```
