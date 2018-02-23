export const flattenProps = props => {

   if (!props) return props;

   if (props.jsxSpread) {
      props = {
         ...props,
         ...props.jsxSpread.reduce((acc, props) => {
            for (let key in props) {
               acc[key] = props[key];
            }
            return acc;
         }, {})
      };
   }

   if (props.$props !== undefined) {
      props = {
         ...props.$props,
         jsxAttributes: props.jsxAttributes,
         jsxSpread: props.jsxSpread,
         children: props.children
      };
   }

   return props;
};
