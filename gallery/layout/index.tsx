import {cx, Link, ContentResolver, Menu, Submenu} from 'cx/widgets';
import {ContentPlaceholder, bind, tpl, computable} from 'cx/ui';
import Controller from "./Controller";
import {loadTheme} from '../themes';


export default <cx>
    <div
        controller={Controller}
        class={computable("layout.aside.open", "$route.theme", (nav, theme) => ({
            "layout": true,
            ["theme-"+ theme]: true,
            "nav": nav
        }))}
    >
        <main
            class="main"
            onMouseDownCapture={(...args) => {
                let {controller} = args[1];
                controller.onMainClick(...args)
            }}
        >
            <ContentPlaceholder />
        </main>
        <header class="header">
            <div class="title">
                <i
                    class={{
                        hamburger: true,
                        open: {bind: 'layout.aside.open'}
                    }}
                    onClick={(...args) => {
                        let {store} = args[1];
                        store.toggle('layout.aside.open');
                    }}
                />
                <ContentPlaceholder name="header"/>
                <div styles="flex:1"/>
                <ContentPlaceholder name="links"/>
            </div>
            <div class="tabs">
                <ContentPlaceholder name="tabs"/>
            </div>
        </header>

        <aside class="aside">
            <header>
                <h1><a href="https://cxjs.io/">CxJS</a> Gallery</h1>
                <div>
                    Theme:
                    <Menu horizontal styles="display: inline-block; margin-left: 5px; font-weight: 500">
                        <Submenu arrow>
                            <a text={{bind: "themeName"}} />
                            <Menu putInto="dropdown">
                                <Link href={tpl("~/material{$route.remainder}")}>Material</Link>
                                <Link href={tpl("~/frost{$route.remainder}")}>Frost</Link>
                                <Link href={tpl("~/core{$route.remainder}")}>Core</Link>
                                <Link href={tpl("~/dark{$route.remainder}")}>Dark</Link>
                            </Menu>
                        </Submenu>
                    </Menu>
                </div>
            </header>
            <div class="aside-nav">
                <ContentPlaceholder name="nav" />
            </div>
        </aside>
        <ContentResolver
            params={bind("$route.theme")}
            onResolve={theme => {
                switch (theme) {
                    case "material":
                        System.import("../themes/material").then(() => loadTheme("material"));
                        return null;

                    case "frost":
                        System.import("../themes/frost").then(() => loadTheme("frost"));
                        return null;

                    case "dark":
                        System.import("../themes/dark").then(() => loadTheme("dark"));
                        return null;

                    case "core":
                        System.import("../themes/core").then(() => loadTheme("core"));
                        return null;
                }
            }}
        />
    </div>
</cx>
