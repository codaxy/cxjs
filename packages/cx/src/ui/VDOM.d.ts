export interface VDOM {
   createElement(type, props, ...children);
   allowRenderOutputCaching?: boolean;
}