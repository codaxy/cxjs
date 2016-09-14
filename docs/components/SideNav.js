import {HtmlElement} from 'cx/ui/HtmlElement';
import {List} from 'cx/ui/List';
import {Repeater} from 'cx/ui/Repeater';
import {Text} from 'cx/ui/Text';
import {Link} from 'cx/ui/nav/Link';
import {KeySelection} from 'cx/ui/selection/KeySelection';
import {Menu} from 'cx/ui/nav/Menu';
import {TreeAdapter} from 'cx/ui/grid/TreeAdapter';
import {History} from 'cx/app/History';
import {Url} from 'cx/app/Url';



const onItemClick = (e, {store}) => {
   e.preventDefault();
   e.stopPropagation();
   var record = store.get('$topic');
   if (record.url)
      History.pushState({}, null, Url.resolve(record.url));
   else
      store.set('$topic.expanded', !record.expanded);
   return false;
}

export const SideNav = <cx>
   <List class="cxb-sidenav"
         records:bind="contents"
         recordName="$topic"
         adapter={{type: TreeAdapter, childrenField: 'articles', expandedField: 'expanded'}}
         selection={{type: KeySelection, bind: 'url', keyField: 'url'}}
         onItemClick={onItemClick}>

      <div visible:expr="{$topic.$level} == 0" trimWhitespace={false}
            class="cxe-sidenav-topic">
         <Text bind="$topic.topic" />
         <span class={{
            "cxe-sidenav-arrow": true,
            "cxs-expanded": {expr: "{$topic.expanded}"}}}
         />
      </div>

      <Link visible:expr="{$topic.$level} > 0"
            text:bind="$topic.title"
            href:bind="$topic.url"
            url:bind="url"
            match="prefix"
            tabIndex={-1}
      />

   </List>
</cx>

// export const SideNav = <cx>
//    <Menu mod="sidenav">
//    <Repeater records:bind="contents" recordName="$topic">
//       <a class="topic" text:bind="$topic.topic" href="#" onClick={(e, {store})=>{ store.toggle('$topic.expanded')}}></a>
//       <Repeater records:bind="$topic.articles" recordName="$article" visible:bind="$topic.expanded">
//          <Link href:bind="$article.url" text:bind="$article.title" />
//       </Repeater>
//    </Repeater>
//    </Menu>
// </cx>
