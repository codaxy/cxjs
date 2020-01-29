import {HtmlElement, Link, Text, Menu, FlexRow, Icon} from 'cx/widgets';
import {Preview} from 'app/components/Preview';

import Controller from './Controller';

export default <cx>
   <div class="cxb-app" controller={Controller}>
      <header>
         <FlexRow align="center">
            <Menu horizontal mod="main" itemPadding="medium">
               <a href="javascript:history.back()">
                  <i class="fa fa-arrow-left" />
               </a>
            </Menu>
            <h1 style="padding: 0 10px; text-align:center;flex:1 0 0">
               <Text bind="fiddle.fiddleName" />
            </h1>
            <Menu horizontal mod="main" itemPadding="medium">
               <Link href:tpl="~/?f={qs.f}" ws>
                  <i class="fa fa-pencil" />
                  Fiddle
               </Link>
            </Menu>
         </FlexRow>
      </header>

      <main class="cxe-app-preview-wrap">
         <div visible:expr="{loading}" style="padding: 10px">
            <Icon name="loading" />
         </div>
         <Preview
            visible:expr="!{loading} && {fiddle.compiledJS}"
            js:bind="fiddle.compiledJS"
            data:bind="fiddle.data"
         />
         <style type="text/css" innerHtml:bind="fiddle.css" scoped />
      </main>
   </div>
</cx>
