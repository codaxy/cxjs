import * as React from 'inferno-compat';
import * as Inferno from 'inferno';

var vdom = React;
vdom.DOM = React;
vdom.createStaticVElement = Inferno.createStaticVElement;
vdom.createOptBlueprint = Inferno.createOptBlueprint;
vdom.createVComponent = Inferno.createVComponent;
vdom.ValueTypes = Inferno.ValueTypes;
vdom.ChildrenTypes = Inferno.ChildrenTypes;
vdom.NodeTypes = Inferno.NodeTypes;

export const VDOM = vdom;