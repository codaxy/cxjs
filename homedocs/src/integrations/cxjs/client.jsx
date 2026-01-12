import { Cx } from "cx/ui";
import { Store } from "cx/data";
import { createRoot } from "react-dom/client";
import React from "react";

export default (element) => {
  return (Component, props, { default: children, ...slotted }, { client }) => {
    const store = new Store();

    // Recreate widget tree
    let widget;
    if (Component.isComponentType) {
      widget = { type: Component, ...props };
    } else {
      widget = Component(props);
    }

    // Hydrate
    const root = createRoot(element);
    root.render(React.createElement(Cx, { widget, store, subscribe: true }));
  };
};
