import { Cx } from "cx/ui";
import { Store } from "cx/data";
import { createRoot } from "react-dom/client";
import React from "react";

// Check if value is a CxJS widget config object (has $type or type property)
function isCxWidgetConfig(value) {
  return value && typeof value === "object" && (value.$type || value.type);
}

export default (element) => {
  return (Component, props, { default: children, ...slotted }, { client }) => {
    const store = new Store();

    // Recreate widget tree
    let widget;
    // If it's directly a CxJS widget config object
    if (isCxWidgetConfig(Component)) {
      widget = Component;
    } else if (Component.isComponentType) {
      widget = { type: Component, ...props };
    } else {
      widget = Component(props);
    }

    // Hydrate
    const root = createRoot(element);
    root.render(React.createElement(Cx, { widget, store, subscribe: true }));
  };
};
