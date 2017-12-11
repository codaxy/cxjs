import * as Cx from '../core';

interface IconProps extends Cx.WidgetProps {

    /** Name under which the icon is registered. */
    name?: Cx.StringProp,

    /** Additional CSS classes to be applied to the field. 
     * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. */
    className?: Cx.ClassProp,

    /** Additional CSS classes to be applied to the field. 
     * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. */
    class?: Cx.ClassProp,

    /** Style object applied to the wrapper div. Used for setting the dimensions of the field. */
    style?: Cx.StyleProp,
    
    /** Base CSS class to be applied to the element. Default is `icon`. */
    baseClass?: string

}

export class Icon extends Cx.Widget<IconProps> {
   static restoreDefaultIcons();

   static clear();

   static register(name: string, icon: any, defaultIcon: boolean);

   static unregister(...args: string[]);

   static registerFactory(factory: (name: string, props: { [key: string]: any }) => any);

   static render(name: string, props: { [key: string]: any });
}
