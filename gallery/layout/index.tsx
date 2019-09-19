import {cx, Link, ContentResolver, Menu, Submenu, Icon, HScroller} from 'cx/widgets';
import {ContentPlaceholder, bind, tpl, computable} from 'cx/ui';
import Controller from "./Controller";
import {loadTheme} from '../themes';


export default <cx>
    <div
        controller={Controller}
        class={computable("layout.aside.open", "$route.theme", (nav, theme) => ({
            "layout": true,
            ["theme-" + theme]: true,
            "nav": nav
        }))}
    >
        <main
            class="main"
            onMouseDownCapture={(...args: any) => {
                let {controller} = args[1];
                controller.onMainClick(...args)
            }}
        >
            <ContentResolver
                params={bind("$route.theme")}
                onResolve={theme => {
                    switch (theme) {
                        case "material":
                            return import(/* webpackChunkName: 'material' */ "../themes/material")
                                .then(() => {
                                    loadTheme("material");
                                    return <cx><ContentPlaceholder/></cx>;
                                });

                        case "frost":
                            return import(/* webpackChunkName: 'frost' */ "../themes/frost")
                                .then(() => {
                                    loadTheme("frost");
                                    return <cx><ContentPlaceholder/></cx>;
                                });

                        case "dark":
                            return import(/* webpackChunkName: 'dark' */"../themes/dark")
                                .then(() => {
                                    loadTheme("dark");
                                    return <cx><ContentPlaceholder/></cx>;
                                });

                        case "core":
                            return import(/* webpackChunkName: 'core' */"../themes/core").then(() => {
                                loadTheme("core");
                                return <cx><ContentPlaceholder/></cx>;
                            });

                        case "aquamarine":
                            return import(/* webpackChunkName: 'aquamarine' */"../themes/aquamarine").then(() => {
                                loadTheme("aquamarine");
                                return <cx><ContentPlaceholder/></cx>;
                            });
                        
                        case "material-dark":
                          return import(/* webpackChunkName: 'material-dark' */"../themes/material-dark").then(() => {
                              loadTheme("material-dark");
                              return <cx><ContentPlaceholder/></cx>;
                          });

                        case "space-blue":
                            return import(/* webpackChunkName: 'space-blue' */"../themes/space-blue").then(() => {
                                loadTheme("space-blue");
                                return <cx><ContentPlaceholder/></cx>;
                            });

                    }
                }}
            />
        </main>
        <header class="header">
            <div class="title">
                <i
                    class={{
                        hamburger: true,
                        open: {bind: 'layout.aside.open'}
                    }}
                    onClick={(...args: any) => {
                        let {store} = args[1];
                        store.toggle('layout.aside.open');
                    }}
                />
                <ContentPlaceholder name="header"/>
                <div styles="flex:1"/>
                <ContentPlaceholder name="links"/>
            </div>
            <div class="tabs">
                <HScroller>
                    <ContentPlaceholder name="tabs"/>
                </HScroller>
            </div>
        </header>

        <aside class="aside">
            <header>
                <h1><a href="https://cxjs.io/">
                    <Icon name="cx"/>
                </a> Gallery</h1>
                <div>
                    Theme:
                    <ContentResolver
                        params={bind("$route.theme")}
                        onResolve={() => <cx>
                            <Menu
                                horizontal
                                styles="display: inline-block; margin-left: 5px; font-weight: 500"
                            >
                                <Submenu arrow>
                                    <a text={{bind: "themeName"}}/>
                                    <Menu putInto="dropdown">
                                        <Link href={tpl("~/aquamarine{$route.remainder}")}>Aquamarine</Link>
                                        <Link href={tpl("~/material{$route.remainder}")}>Material</Link>
                                        <Link href={tpl("~/material-dark{$route.remainder}")}>Material Dark</Link>
                                        <Link href={tpl("~/frost{$route.remainder}")}>Frost</Link>
                                        <Link href={tpl("~/core{$route.remainder}")}>Core</Link>
                                        <Link href={tpl("~/dark{$route.remainder}")}>Dark</Link>
                                        <Link href={tpl("~/space-blue{$route.remainder}")}>Space blue</Link>
                                    </Menu>
                                </Submenu>
                            </Menu>
                        </cx>}
                    />
                </div>
            </header>
            <div class="aside-nav">
                <ContentPlaceholder name="nav"/>
            </div>
        </aside>
    </div>
</cx>
