export const flattenProps = (props: any): any => {

   if (!props) return {};

   if (props.jsxSpread) {
      props = {
         ...props,
         ...props.jsxSpread.reduce((acc: any, prop: any) => Object.assign(acc, prop), {})
      };
   }

   if (props.$props !== undefined) {
      props = {
         ...props.$props,
         jsxAttributes: props.jsxAttributes,
         children: props.children
      };
   }

   return {...props};
};
