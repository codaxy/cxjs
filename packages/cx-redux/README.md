# cx-redux

This package contains helper classes required to replace standard [CxJS](https://cxjs.io/) data store
with Redux.

### Installation

```
npm install cx-redux --save
```

### Usage

Set the application to use a Redux powered store.

```
import { createStore, ReduxStoreView } from "cx-redux";
import reducer from "./reducers";

const reduxStore = createStore(reducer);
const store = new ReduxStoreView();
```

### Examples

Please visit [Cx Redux Examples](https://github.com/codaxy/cx-redux-examples) project to see this package in action.


