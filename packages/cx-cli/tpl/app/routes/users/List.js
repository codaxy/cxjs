import {
    Section,
    FlexRow,
    TextField,
    Link,
    LinkButton,
    Repeater,
    Rescope
} from "cx/widgets";

import Controller from "./ListController";
import "cx/widgets/icons";

export default (
    <cx>
        <h2 putInto="header">Users</h2>
        <Rescope bind="$page" controller={Controller}>
            <Section mod="card">
                <FlexRow spacing>
                    <TextField
                        value-bind="search"
                        placeholder="Search..."
                        style="flex: 1 0 0"
                        inputStyle="border-color: transparent; box-shadow: none; font-size: 16px"
                        icon-expr="{status}=='loading' ? 'loading' : 'search'"
                        showClear
                    />
                    <LinkButton mod="hollow" href="~/users/new">
                        Add User
                    </LinkButton>
                </FlexRow>
            </Section>
            <FlexRow spacing wrap style="margin-top: 15px">
                <Repeater
                    records-bind="results"
                    recordAlias="$user"
                    idField="id"
                >
                    <Link href-tpl="~/users/{$user.id}" class="user-card">
                        <Section mod="card" class="user-card-body">
                            <img src="http://placehold.it/50x50" />
                            <h6 text-bind="$user.display" />
                            @<span text-bind="$user.username" />
                        </Section>
                    </Link>
                </Repeater>
            </FlexRow>
        </Rescope>
    </cx>
);
