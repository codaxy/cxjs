import React from "react";
import ReactDOMServer from "react-dom/server";
import { Cx } from "cx/ui";
import { Store } from "cx/data";

// Check if value is a CxJS widget config object (has $type or type property)
function isCxWidgetConfig(value) {
  return value && typeof value === "object" && (value.$type || value.type);
}

export default {
  check(Component, props, children) {
    // If Component is directly a CxJS widget config object (export default <cx>...</cx>)
    if (isCxWidgetConfig(Component)) {
      return true;
    }

    // If Component is a Cx Widget class
    if (
      Component &&
      Component.prototype &&
      typeof Component.prototype.render === "function" &&
      Component.prototype.declareData
    ) {
      return true;
    }

    // If Component is a function, it might be a Cx factory or a React component.
    try {
      if (typeof Component === "function") {
        // Heuristic: call it and check result.
        // NOTE: This runs the component logic during check phase.
        // React components that use hooks will THROW here because we are not in a hook context.
        const result = Component(props || {});

        if (result && typeof result === "object") {
          // React elements have $$typeof property
          if (result["$$typeof"]) return false;

          // If it's a plain object (likely Cx config), we claim it.
          return true;
        }
      }
    } catch (e) {
      // Threw error -> likely React component needing hooks context
      return false;
    }

    return false;
  },

  renderToStaticMarkup(Component, props, { default: children, ...slotted }) {
    const store = new Store({ sealed: true });

    let widget;
    // If it's directly a CxJS widget config object
    if (isCxWidgetConfig(Component)) {
      widget = Component;
    }
    // If it's a class (Widget), we create an instance or pass it as type
    else if (Component.prototype && Component.prototype.render) {
      widget = { type: Component, ...props };
    } else {
      // If it's a function (factory or functional widget), we execute it
      widget = Component(props);
    }

    // We render the <Cx> component to string
    const html = ReactDOMServer.renderToString(
      React.createElement(Cx, { widget, store, subscribe: true }),
    );

    return { html };
  },
};
