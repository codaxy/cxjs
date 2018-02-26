export const flattenProps = props => {

   if (!props) return props;

   if (props.jsxSpread) {
      props = {
         ...props,
         ...props.jsxSpread.reduce((acc, prop) => Object.assign(acc, prop), {})
      };
   }

   if (props.$props !== undefined) {
      props = {
         ...props.$props,
         jsxAttributes: props.jsxAttributes,
         children: props.children
      };
   }

   return props;
};
