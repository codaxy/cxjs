import {cx, Link, ContentResolver, LookupField} from 'cx/widgets';
import {ContentPlaceholder, bind} from 'cx/ui';
import Controller from "./Controller";
import {loadTheme} from '../themes';

declare let System: any;

export default <cx>
    <div
        controller={Controller}
        class={{
            "layout": true,
            "nav": {bind: "layout.aside.open"}
        }}
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
                <LookupField
                    style="margin-left: auto"
                    value={bind("theme")}
                    required
                    options={[
                        { id: 'material', text: 'Material'},
                        { id: 'frost', text: 'Frost'},
                        { id: 'dark', text: 'Dark'},
                        { id: 'core', text: 'Core'}
                    ]}
                />
            </div>
            <div class="tabs">
                <ContentPlaceholder name="tabs"/>
            </div>
        </header>


        <aside class="aside">
            <h1>Cx App</h1>
            <dl>
                <dt>
                    App
                </dt>
                <dd>
                    <Link href="~/" url={bind("url")}>
                        Home
                    </Link>
                </dd>

                <dd>
                    <Link href="~/about" url={bind("url")}>
                        About
                    </Link>
                </dd>
            </dl>
            <dl>
                <dt>
                    General
                </dt>
                <dd>
                    <Link href="~/buttons" url={bind("url")}>
                        Button
                    </Link>
                </dd>
                <dd>
                    <Link href="~/grids" url={bind("url")}>
                        Grid
                    </Link>
                </dd>
            </dl>
        </aside>
        <ContentResolver
            params={bind("theme")}
            onResolve={theme => {
                switch (theme) {
                    case "material":
                        System.import("../themes/material").then(() => loadTheme("material"));
                        return null;

                    case "frost":
                        System.import("../themes/frost").then(() => loadTheme("frost"));;
                        return null;

                    case "dark":
                        System.import("../themes/dark").then(() => loadTheme("dark"));;
                        return null;

                    case "core":
                        System.import("../themes/core").then(() => loadTheme("core"));;
                        return null;
                }
            }}
        />
    </div>
</cx>
