import {Widget, VDOM} from 'cx/ui/Widget';
import {PureContainer} from 'cx/ui/PureContainer';
import {HtmlElement} from 'cx/ui/HtmlElement';
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
                <tr className={CSS.state({important: p.key, regular: !p.key})}>
                    <td className={CSS.state({long: p.signature > 30})}>
                        {p.signature}
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
        return <table key={key} className="dxb-methodtable">
            <tbody>
            <tr>
                <th>Signature</th>
                <th>Description</th>
            </tr>
            {this.renderChildren(context, instance)}
            </tbody>
        </table>
    }
}

MethodTable.prototype.sort = true;
