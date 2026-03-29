import { HtmlElement } from 'cx/widgets';
import { Widget, VDOM, Container} from 'cx/ui';
import {CSS} from '../app/CSS';

export class MethodTable extends Container {
    init() {
        super.init();
        let methods = this.methods || [];

        if (this.sort) {
            methods.sort((a, b) => {
                if (a.key && !b.key)
                    return -1;
                if (!a.key && b.key)
                    return +1;
                return a.signature < b.signature ? -1 : a.signature > b.signature ? 1 : 0;
            });
        }

        methods.forEach(p=> {
            let r = <cx>
                <tr>
                    <td className={CSS.state({important: p.key})}>
                        <h5>
                            {p.signature}
                        </h5>
                        {p.description}
                    </td>
                </tr>
            </cx>
            this.add(r);
        });
    }

    render(context, instance, key) {
        return <div key={key} className="dxb-methodtable">
            <table>
                <tbody>
                {
                    !this.hideHeader && <tr>
                        <th>Methods</th>
                    </tr>
                }
                {this.renderChildren(context, instance)}
                </tbody>
            </table>
        </div>
    }
}

MethodTable.prototype.sort = true;
MethodTable.prototype.hideHeader = false;
