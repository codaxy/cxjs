import { Controller, FirstVisibleChildLayout, LabelsTopLayout } from "cx/ui";
import { Content, Icon, LookupField, Tab } from "cx/widgets";
import { CodeSnippet } from "../../../components/CodeSnippet";
import { CodeSplit } from "../../../components/CodeSplit";
import { Md } from "../../../components/Md";
import { PureContainer } from "../../widgets";
import { casual } from "../data/casual";

class PageController extends Controller {
   onInit() {
      this.store.set('$page.userOptions', Array.from({length: 50}).map((v, i) => ({
         id: i + 1,
         os: casual.operating_system,
         browser: casual.browser,
         fullName: casual.full_name,
      })));

      this.store.set('$page.browserOptions',
         casual.browsers.map(b => ({
            id: b,
            text: b,
            favorite: Math.random() > 0.5
         }))
      );
   }
}

export const LookupOptionsGrouping = (
   <cx>
      <Md controller={PageController}>
         # Lookup Options Grouping
         <CodeSplit>
            The following example shows how to use `LookupField` options grouping.

            Since `LookupField` uses `List` widget to render drop-down contents, we can specify `grouping`
            configuration through `listOptions` property to implement options grouping.

            The example showcases grouping by single and multiple keys, as well as usage of `aggregates` configuration for counting options within a group.

            <div layout={{ type: LabelsTopLayout, vertical: true, mod: 'stretch', columns: 2 }}>
               <LookupField
                  label="Single level"
                  value-bind="$page.browser"
                  options-bind='$page.browserOptions'
                  listOptions={{
                     grouping: {
                        key: {
                           favorite: {
                              value: { bind: '$option.favorite' },
                              direction: 'DESC',
                           },
                        },
                        aggregates: {
                           count: {
                               type: 'count',
                               value: 1
                           }
                        },
                        header: <FirstVisibleChildLayout>
                           <PureContainer visible-expr="{$group.favorite} == 'true'">
                              <div style="display: flex; flex-direction: row; align-items: center; gap: 6px; font-weight: bold; background-color: #f2f2f2; padding: 8px;">
                                 <Icon name='star'/>
                                 <div text="Favorites" />
                              </div>
                           </PureContainer>
                           <div text='Other' style="background-color: #f2f2f2; padding: 8px; font-weight: bold" />
                        </FirstVisibleChildLayout>,
                        footer: <div style='font-weight: bold; padding: 8px;' text-tpl='Total of {$group.count} item(s)' />
                     },
                     itemStyle: 'padding-left: 24px;'
                  }}
               />

               <LookupField
                  label="Multiple levels"
                  value-bind="$page.user"
                  options-bind='$page.userOptions'
                  optionTextField="fullName"
                  listOptions={{
                     grouping: [{
                        key: {
                           os: {
                              value: { bind: '$option.os' },
                              direction: 'ASC',
                           },
                        },
                        header: <div
                           text-bind='$group.os'
                           style="font-weight: bold; font-size: 14px; background-color: #f2f2f2; padding: 8px"
                        />
                     }, {
                        key: {
                           browser: {
                              value: { bind: '$option.browser' },
                              direction: 'ASC',
                           },
                        },
                        header: <div
                           text-bind='$group.browser'
                           style="font-size: 14px; padding: 8px 0 8px 24px; background-color: #00000008"
                        />
                     }],
                     itemStyle: 'padding-left: 40px;'
                  }}
               />
            </div>

            <Content name="code">
               <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />
               <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />

               <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="2ISVGCiL">{`
                  class PageController extends Controller {
                     onInit() {
                        this.store.set('$page.userOptions', Array.from({length: 50}).map((v, i) => ({
                           id: i + 1,
                           os: casual.operating_system,
                           browser: casual.browser,
                           fullName: casual.full_name,
                        })));

                        this.store.set('$page.browserOptions',
                           casual.browsers.map(b => ({
                              id: b,
                              text: b,
                              favorite: Math.random() > 0.5
                           }))
                        );
                     }
                  }
               `}</CodeSnippet>
               <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="2ISVGCiL">{`
                  <div layout={{ type: LabelsTopLayout, vertical: true, mod: 'stretch', columns: 2 }}>
                     <LookupField
                        label="Single level"
                        value-bind="$page.browser"
                        options-bind='$page.browserOptions'
                        listOptions={{
                           grouping: {
                              key: {
                                 favorite: {
                                    value: { bind: '$option.favorite' },
                                    direction: 'DESC',
                                 },
                              },
                              aggregates: {
                                 count: {
                                       type: 'count',
                                       value: 1
                                 }
                              },
                              header: <FirstVisibleChildLayout>
                                 <PureContainer visible-expr="{$group.favorite} == 'true'">
                                    <div style="display: flex; flex-direction: row; align-items: center; gap: 8px; background-color: #f2f2f2; padding: 8px;">
                                       <Icon name='star'/>
                                       <div text="Favorites" />
                                    </div>
                                 </PureContainer>
                                 <div text='Other' style="background-color: #f2f2f2; padding: 8px;" />
                              </FirstVisibleChildLayout>,
                              footer: <div style='font-weight: bold; padding: 8px;' text-tpl='{$group.count} item(s)' />
                           },
                           itemStyle: 'padding-left: 24px;'
                        }}
                     />

                     <LookupField
                        label="Multiple levels"
                        value-bind="$page.user"
                        options-bind='$page.userOptions'
                        optionTextField="fullName"
                        listOptions={{
                           grouping: [{
                              key: {
                                 os: {
                                    value: { bind: '$option.os' },
                                    direction: 'ASC',
                                 },
                              },
                              header: <div
                                 text-bind='$group.os'
                                 style="font-weight: bold; font-size: 14px; background-color: #f2f2f2; padding: 8px"
                              />
                           }, {
                              key: {
                                 browser: {
                                    value: { bind: '$option.browser' },
                                    direction: 'ASC',
                                 },
                              },
                              header: <div
                                 text-bind='$group.browser'
                                 style="font-size: 14px; padding: 8px 0 8px 24px; background-color: #00000008"
                              />
                           }],
                           itemStyle: 'padding-left: 40px;'
                        }}
                     />
                  </div>
               `}</CodeSnippet>
            </Content>
         </CodeSplit>
      </Md>
   </cx>
);
