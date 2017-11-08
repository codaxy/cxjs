import { PureContainer, HtmlElement } from 'cx/widgets';
import { Widget, VDOM } from 'cx/ui';
import {CSS} from '../app/CSS';

export class MethodTable extends PureContainer {
    init() {
        super.init();
        var methods = this.methods || [];

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
            var r = <cx>
                <tr>
                    <td className={CSS.state({long: p.signature > 30, important: p.key, regular: !p.key})}>
                        <h4>
                            {p.signature}
                        </h4>
                    </td>
                    <td>
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
                        <th>Signature</th>
                        <th>Description</th>
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
