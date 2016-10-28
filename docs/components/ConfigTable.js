import {Widget, VDOM} from 'cx/ui/Widget';
import {HtmlElement} from 'cx/ui/HtmlElement';
import {PureContainer} from 'cx/ui/PureContainer';
import {CSS} from '../app/CSS';

export class ConfigTable extends PureContainer {
    init() {
        super.init();
        var props = this.props || {};

        var keys = Object.keys(props).sort((a, b) => {
            if (props[a].key && !props[b].key)
                return -1;
            if (!props[a].key && props[b].key)
                return +1;
            return a < b ? -1 : a > b ? 1 : 0;
        });

        keys.forEach(key=> {
            var p = props[key];
            console.log(key);
            if (p) {
                var name = [key];
                if (p.alias)
                    name.push(<cx><br/></cx>, p.alias);

                var r = <cx>
                    <tr className={CSS.state({important: p.key, regular: !p.key})}>
                        <td className={CSS.state({long: key.length > 16})}>
                            {name}
                        </td>
                        <td>
                            {p.description}
                        </td>
                        <td>
                            {p.type}
                        </td>
                    </tr>
                </cx>
                this.add(r);
            }
        });
    }

    render(context, instance, key) {
        return <div key={key} className="dxb-configtable">
            <table>
                <tbody>
                <tr>
                    <th>Property</th>
                    <th>Description</th>
                    <th>Type</th>
                </tr>
                {this.renderChildren(context, instance)}
                </tbody>
            </table>
        </div>
    }
}
