export const flattenProps = props => props && props.$props !== undefined ? { ...props.$props, jsxAttributes: props.jsxAttributes, children: props.children } : props;
