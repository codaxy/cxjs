import { HtmlElement, Text, TextField, List, HighlightedSearchText, Checkbox, Content, Tab } from 'cx/widgets';
import { LabelsLeftLayout, bind, LabelsTopLayout } from 'cx/ui';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from '../../components/ImportPath';

import configs from './configs/HighlightedSearchText';
import { getSearchQueryPredicate } from 'cx/util';

export const HighlightedSearchTextPage = <cx>
   <Md>
      # HighlightedSearchText

      <ImportPath path="import { HighlightedSearchText } from 'cx/widgets';" />

      <CodeSplit>

        The `HighlightedSearchText` is used to render text with highligted search terms. Check how this works in the following example:

         <div class="widgets">
             <LabelsTopLayout columns={1}>
                <TextField label="Search" value-bind="$page.search.query" />
                <Checkbox value-bind="$page.search.filter">Filter</Checkbox>
            </LabelsTopLayout>
            <List
                records={[
                    { text: 'Belgrade'},
                    { text: 'Zagreb'},
                    { text: 'Sarajevo'},
                    { text: 'Banja Luka'}
                ]}
                mod="bordered"
                filterParams-bind="$page.search"
                onCreateFilter={(params) => {
                    let { query, filter } = params || {};
                    let predicate = getSearchQueryPredicate(query);
                    if (!filter) return () => true;
                    return record => predicate(record.text);
                }}
            >
                <HighlightedSearchText text-bind="$record.text" query-bind="$page.search.query" />
            </List>
         </div>

         <Content name="code">
            <Tab value-bind="$page.code.tab" tab="list" mod="code" default><code>List</code></Tab>

            <CodeSnippet fiddle="jF9CqiXr" visible-expr="{$page.code.tab}=='list'">{`
                <LabelsTopLayout columns={1}>
                    <TextField label="Search" value-bind="$page.search.query" />
                    <Checkbox value-bind="$page.search.filter">Filter</Checkbox>
                </LabelsTopLayout>
                <List
                    records={[
                        { text: 'Belgrade'},
                        { text: 'Zagreb'},
                        { text: 'Sarajevo'},
                        { text: 'Banja Luka'}
                    ]}
                    mod="bordered"
                    filterParams-bind="$page.search"
                    onCreateFilter={(params) => {
                        let { query, filter } = params || {};
                        let predicate = getSearchQueryPredicate(query);
                        if (!filter) return () => true;
                        return record => predicate(record.text);
                    }}
                >
                    <HighlightedSearchText text-bind="$record.text" query-bind="$page.search.query" />
                </List>
            `}</CodeSnippet>
         </Content>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={{...configs, mod: false}} />

   </Md>
</cx>
