import { render, createElement, unmountComponentAtNode, findDOMNode, Component } from 'preact-compat';

export const VDOM = {
   render,
   createElement,
   Component,
   DOM: {
      render,
      findDOMNode,
      unmountComponentAtNode
   },
   allowRenderOutputCaching: false
};

