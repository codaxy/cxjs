import {TextField, Text, Repeater, List, Link, Menu, HtmlElement} from 'cx/widgets';
import {Controller, History} from 'cx/ui';
import {Window} from 'cx/widgets';
import {KeyCode} from 'cx/util';

class SearchController extends Controller {
    init() {
        super.init();

        this.addComputable('search.results', ['search.query', 'contents'], (q, contents) => {
            var result = [];
            contents.forEach(topic => {
                var filter = a => true;
                if (q) {
                    var checks = q.split(' ').map(w => new RegExp(w, 'gi'));
                    filter = a => checks.every(ex => a.title.match(ex));
                }
                var articles = topic.articles.filter(filter);
                if (articles.length > 0)
                    result.push(...articles.map(a => ({
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
        if (e.keyCode == KeyCode.esc)
            instance.dismiss();
        else if (this.listKeyDownPipe)
            this.listKeyDownPipe(e);
    }

    onItemClick(e, {store}) {
        var url = store.get('$record.url');
        History.pushState({}, null, url);
        if (window.innerWidth < 1000)
            store.set('search.visible', false);
    }
}

var searchProps = {
    style: "width:300px;height:400px;"
};

if (window.innerWidth > 1000 && window.innerHeight > 800)
    searchProps.center = true;
else
    searchProps.style += "left:40px;top:25px";

export const SearchWindow = <cx>
    <Window
        visible={{bind: "search.visible", defaultValue: false}}
        {...searchProps}
        backdrop
        autoFocus={false}
        header={
            <TextField
                value:bind="search.query"
                style="width:100%;"
                inputStyle="font-size:20px;height:40px;"
                placeholder="Search..."
                autoFocus
            />
        }
        closable={false}
        onKeyDown="onKeyDown"
        controller={SearchController}
    >
        <List
            records:bind="search.results"
            focused
            pipeKeyDown="pipeKeyDown"
            onItemClick="onItemClick"
            itemStyle="padding:10px 20px"
        >
            <div style={{fontWeight: {expr: "{$record.url} == {url} ? 'bold': 'normal'"}}}>
                <div text:bind="$record.topic" style="font-size:9px"/>
                <Text bind="$record.title"/>
            </div>
        </List>
    </Window>
</cx>;
