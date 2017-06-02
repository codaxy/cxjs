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
                <h1><a href="https://cxjs.io/">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-347 249.7 48 48.000001">
                        <g>
                            <path fill="currentColor" opacity="0.7" d="M-337.1 273.16l-4.23-7.33h8.46z"/>
                            <path fill="currentColor" d="M-318.32 273.16l-4.23-7.33h8.46z"/>
                            <path fill="currentColor" opacity="0.7" d="M-337.53 273.43h-8.45l4.22-7.33z"/>
                            <path fill="currentColor" d="M-309.38 273.43h-8.46l4.23-7.33z"/>
                            <path fill="currentColor" opacity="0.7" d="M-332.4 265.03l-4.22-7.33h8.46z"/>
                            <path fill="currentColor" d="M-304.24 265.03l-4.23-7.33h8.45z"/>
                            <path fill="currentColor" d="M-322.97 265.03l-4.28-7.33h8.5z"/>
                            <path fill="currentColor" opacity="0.7" d="M-332.87 265.3h-8.46l4.23-7.33z"/>
                            <path fill="currentColor" opacity="0.7" d="M-323.45 265.3h-8.46l4.2-7.33z"/>
                            <path fill="currentColor" d="M-314.1 265.3h-8.45l4.23-7.33z"/>
                            <path fill="currentColor" d="M-308.9 273.16l-4.23-7.33h8.46z"/>
                            <path fill="currentColor" d="M-304.67 265.3h-8.46l4.23-7.33z"/>
                            <path fill="currentColor" d="M-314.1 281.57h-8.45l4.23-7.33z"/>
                            <path fill="currentColor" d="M-313.6 281.3l-4.24-7.33h8.46z"/>
                            <path fill="currentColor" d="M-318.32 289.43l-4.23-7.33h8.46z"/>
                            <path fill="currentColor" d="M-304.67 281.57h-8.46l4.23-7.33z"/>
                            <path fill="currentColor" d="M-308.9 289.43l-4.23-7.33h8.46z"/>
                            <path fill="currentColor" opacity="0.7" d="M-341.76 281.3l-4.22-7.33h8.45z"/>
                            <path fill="currentColor" opacity="0.7" d="M-332.87 281.57h-8.46l4.23-7.33z"/>
                            <path fill="currentColor" opacity="0.7" d="M-337.1 289.43l-4.23-7.33h8.46z"/>
                            <path fill="currentColor" opacity="0.7" d="M-327.68 289.43l-4.23-7.33h8.43z"/>
                            <path fill="currentColor" opacity="0.7" d="M-328.16 289.7h-8.46l4.23-7.33z"/>
                            <path fill="currentColor" d="M-318.75 289.7h-8.5l4.28-7.33z"/>
                            <path fill="currentColor" d="M-300.02 289.7h-8.45l4.23-7.33z"/>
                        </g>
                    </svg>
                </a> Gallery</h1>
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
