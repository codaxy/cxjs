import * as Cx from '../../core';
import {ButtonProps} from '../Button';
import * as React from 'react';

interface LinkButtonProps extends ButtonProps {

   /** Url to the link's target location. Should start with `~/` or `#/` for pushState/hash based navigation. */
   href?: Cx.StringProp,

   /** Binding to the current url location in the store. If `href` matches `url`, additional CSS class `active` is applied. */
   url?: Cx.StringProp,

   /** 
    * Either `equal` or `prefix`. Default is `equal` which means that `url` must be exactly match `href` in order to consider the link active. 
    * In `prefix` mode, if `href` is a prefix of `url`, the link is considered active. 
    */
   match?: string
}

export class LinkButton extends Cx.Widget<LinkButtonProps> {}