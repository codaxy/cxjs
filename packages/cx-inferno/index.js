import { render, createElement, unmountComponentAtNode, findDOMNode, Component } from 'inferno-compat';

export const VDOM = {
   render,
   createElement,
   Component,
   DOM: {
      render,
      findDOMNode,
      unmountComponentAtNode
   }
};
