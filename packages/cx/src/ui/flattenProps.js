export const flattenProps = props => props && props.$props !== undefined ? { ...props.$props, jsxAttributes: props.jsxAttributes, children: props.children } : props;

export const spreadProps = props => {
   if (props.jsxSpread) {
      props = {
         ...props,
         ...props.jsxSpread.reduce(
            (acc, props) => {
               for (let key in props) {
                  acc[key] = props[key];
               }
               return acc;
            }, 
            {}
         )
      }
   }
   
   return props;
}