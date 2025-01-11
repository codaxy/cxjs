var React = require("react"),
   {
      unstable_batchedUpdates,
      render,
      findDOMNode,
      createPortal,
      unstable_renderSubtreeIntoContainer,
      hydrate,
   } = require("react-dom"),
   { createRoot, hydrateRoot } = require("react-dom/client");

var vdom = React;
vdom.DOM = {
   unstable_batchedUpdates,
   render,
   findDOMNode,
   createPortal,
   createRoot,
   hydrateRoot,
   hydrate,
   unstable_renderSubtreeIntoContainer,
};

module.exports = {
   VDOM: vdom,
};
