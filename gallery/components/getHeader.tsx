import {cx, LinkButton, ContentPlaceholder} from 'cx/widgets';

interface HeaderConfig {
    title: string;
    docsUrl?: string;
    tabs?: {
        [tab: string]: string
    }
}

export function getHeader(config: HeaderConfig): any {

    if (config.tabs == null)
        config.tabs = {
            'regular': 'Regular'
        };

    let tabs = [], defaultValue;
    for (let tab in config.tabs) {
        if (!defaultValue)
            defaultValue = tab;
        tabs.push(<cx>
            <LinkButton
                mod="hollow"
                href={"+/" + tab}
                url={{bind: "$root.url"}}
                text={config.tabs[tab]}
            />
        </cx>)
    }

    return <cx>
        <h2 putInto="header" text={config.title}/>
        <div putInto="tabs">
            {tabs}
        </div>
        {config.docsUrl &&
        <div putInto="links">
            <ContentPlaceholder name="github"/>
            &nbsp;
            &nbsp;
            <a href={config.docsUrl} target="_blank">Docs</a>
        </div>
        }
    </cx>
}
