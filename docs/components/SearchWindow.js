import {Window} from 'cx/ui/overlay/Window';
import {TextField} from 'cx/ui/form/TextField';
import {Text} from 'cx/ui/Text';
import {Repeater} from 'cx/ui/Repeater';
import {List} from 'cx/ui/List';
import {Link} from 'cx/ui/nav/Link';
import {Menu} from 'cx/ui/nav/Menu';
import {Controller} from 'cx/ui/Controller';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {History} from 'cx/app/History';

class SearchController extends Controller {
    init() {
        super.init();

        this.addComputable('search.results', ['search.query', 'contents'], (q, contents) => {
            var result = [];
            contents.forEach(topic => {
                var filter = a => true;
                if (q) {
                    var checks = q.split(' ').map(w=>new RegExp(w, 'gi'));
                    filter = a => checks.every(ex=>a.title.match(ex));
                }
                var articles = topic.articles.filter(filter);
                if (articles.length > 0)
                    result.push(...articles.map(a=>({
                        ...a,
                        topic: topic.topic
                    })));
            });
            return result;
        }, true);
    }

    pipeKeyDown(cb) {
        this.listKeyDownPipe = cb;
    }

    onKeyDown(e, instance) {
        if (e.keyCode == 27)
            instance.dismiss();
        else if (this.listKeyDownPipe)
            this.listKeyDownPipe(e);
    }

    onItemClick(e, {store}) {
        var url = store.get('$record.url');
        console.log(url);
        History.pushState({}, null, url);
    }
}

export const SearchWindow = <cx>
    <Window visible={{bind:"search.visible", defaultValue: false}}
            style="width:300px;height:400px;top:50px;left:calc(50% - 150px)"
            backdrop
            autoFocus={false}
            header={
                <TextField value:bind="search.query" style="width:100%;height:40px;" inputStyle="font-size:20px;" placeholder="Search..." autoFocus />
            }
            closable={false}
            onKeyDown="onKeyDown"
            controller={SearchController}>
        <List records:bind="search.results" focused pipeKeyDown="pipeKeyDown" onItemClick="onItemClick" itemStyle="padding:10px 20px">
            <div style={{fontWeight:{expr:"{$record.url} == {url} ? 'bold': 'normal'"}}}>
                <div text:bind="$record.topic" style="font-size:9px" />
                <Text bind="$record.title" />
            </div>
        </List>
    </Window>
</cx>;
