import { Repeater, TextField, Checkbox, Button } from 'cx/widgets';
import { Controller as BaseController } from 'cx/ui';
import { HtmlElement } from 'cx/widgets';

class Controller extends BaseController {
    init() {
        super.init();
        var items = this.store.get('$page.todos');
        // Reset the list to default data if it's empty
        if (!items || !items.length) {
            items = [{
                id: 1,
                text: 'Create a demo app',
                done: true
            }]
            this.store.set('$page.todos', items);
        }  
    }

    onAdd() {
        var items = this.store.get('$page.todos');

        var id = items.reduce((acc, item) => Math.max(acc, item.id), 0) + 1;
        items = items.concat({
            id: id,
            text: this.store.get('$page.text') || `Untitled (${id})`,
            done: false
        });

        this.store.set('$page.todos', items);
        this.store.delete('$page.text');
    }

    onRemove(e, {store}) {
        e.preventDefault();
        var id = store.get('$record.id');
        var items = this.store.get('$page.todos');
        this.store.set('$page.todos', items.filter(item => item.id !== id));
    }
}


export const Todo = <cx>
    <div class="csb-todo-wrap" controller={Controller}>
        <div class="csb-todo">
            <h1>Todo list</h1>

            <div preserveWhitespace>
                <TextField style={{width: 320}}
                           value:bind="$page.text"
                           placeholder="Type a task name here"
                           required
                />
                <Button type="button" onClick="onAdd" disabled:expr="!{$page.text}">Add</Button>
            </div>

            <ul class="csb-task-list">
                <Repeater records:bind="$page.todos">
                    <li class="csb-task">
                        <Checkbox class={{ "css-task-done": {bind: '$record.done'} }}
                                  text-tpl="{$record.text}" value:bind="$record.done"/>
                        
                        <button onClick="onRemove" text="x"/>
                    </li>
                </Repeater>
            </ul>
        </div>
    </div>
</cx>;

