import {HtmlElement, Button, Checkbox, Tab, Link, Menu, Icon} from 'cx/widgets';
import {FirstVisibleChildLayout, PureContainer} from 'cx/ui';

import {CodeMirror} from 'app/components/CodeMirror';
import {Preview} from 'app/components/Preview';

import {addMissingImport} from 'app/core/addImports';

export default phone => <cx>
   <main class={{"cxe-app-main": true, "cxs-single-column": phone}}>
      <div class="cxe-app-left-pane" visible={!phone || { expr: '!{preview.on}' }}>
         <div class="cxe-app-toolbar cxb-toolbar">
            <div class="cxe-toolbar-left" style="padding:5px;" visible={!phone}>
               <Checkbox value:bind="autoImport"
                  text="Auto import"
                  tooltip="Automatically add missing import. Alternatively, use text selection and Ctrl + I."/>
            </div>
            <div class="cxe-toolbar-center" style="flex:3;text-align:center">
               <Tab value:bind="code.tab" tab="js" text="ES"/>
               <Tab value:bind="code.tab" tab="css" text="CSS"/>
               <Tab value:bind="code.tab" tab="data" text="Data"/>
            </div>
            <div class="cxe-toolbar-right" style="padding:5px" visible={!phone}>
               <Button mod="run" tooltip="Ctrl+R"><i class="fa fa-play" style="color: green"/> Run</Button>
            </div>
         </div>
         <CodeMirror mode="jsx" code:bind="fiddle.js" style="flex:1" visible:expr="{code.tab}=='js'"
            onImportName={addMissingImport}/>
         <CodeMirror mode="css" code:bind="fiddle.css" style="flex:1" visible:expr="{code.tab}=='css'"/>
         <CodeMirror mode="javascript" code:bind="fiddle.data" style="flex:1" visible:expr="{code.tab}=='data'"/>
      </div>
      <div class="cxe-app-right-pane" visible={!phone || { expr: '{preview.on}' }}>
         <div class="cxe-app-toolbar cxb-toolbar">
            <div class="cxe-toolbar-left">
            </div>
            <div class="cxe-toolbar-center" style="flex:3;text-align:center">
               <Tab value:bind="preview.tab" tab="result" text="Preview"/>
               <Tab value:bind="preview.tab" tab="js" text="JS"/>
            </div>
            <div class="cxe-toolbar-right">
               <Menu horizontal mod="main" itemPadding="medium">
                  <Link href:tpl="~/?p={qs.f}">
                     <i class="fa fa-expand"/>
                  </Link>
               </Menu>
            </div>
         </div>
         <div class="cxe-app-preview-wrap" visible:expr="{preview.tab}=='result'">
            <div visible:expr="{loading}" style="padding: 10px">
               <Icon name="loading"/>
            </div>
            <Preview js:bind="fiddle.compiledJS" data:bind="fiddle.data"
               visible:expr="!{loading} && {fiddle.compiledJS}"/>
            <style type="text/css" innerHtml:bind="fiddle.css" scoped/>
         </div>
         <CodeMirror mode="jsx" code:bind="fiddle.compiledJS" style="flex:1" visible:expr="{preview.tab}=='js'"/>
      </div>
   </main>
</cx>
