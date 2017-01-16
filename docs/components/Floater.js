import {PureContainer, VDOM} from 'cx/ui';

export class Floater extends PureContainer {
    render(context, instance, key) {
        return <FloaterComponent key={key} instance={instance}/>
    }
}

Floater.prototype.styled = true;
Floater.prototype.baseClass = 'floater';


class FloaterComponent extends VDOM.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    render() {
        let {instance} = this.props;
        let {data, widget, store} = instance;
        let {CSS, baseClass} = widget;

        return (
            <div
                className={CSS.expand(data.classNames, CSS.state({open: this.state.open}))}
                tabIndex={0}
                onBlur={e=>{this.close()}}
            >
                <div className="cxe-floater-drawer">
                    <div className="cxe-floater-button" onClick={ e => {
                        store.toggle('layout.navOpen');
                        e.stopPropagation();
                        e.preventDefault();
                        this.close();
                    }}>
                        <i className="fa fa-bars"/>
                    </div>
                    <div className="cxe-floater-button" onClick={ e => {
                        store.set('search.visible', true)
                        e.stopPropagation();
                        e.preventDefault();
                        this.close();
                    }}>
                        <i className="fa fa-search"/>
                    </div>
                    <div className="cxe-floater-button" onClick={ e => {
                        document.getElementById('content').scrollTop = 0;
                        e.stopPropagation();
                        e.preventDefault();
                        this.close();
                    }}>
                        <i className="fa fa-arrow-up"/>
                    </div>
                </div>
                <div
                    className="cxe-floater-button"
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.setState({
                            open: !this.state.open
                        })
                    }}>
                    <i className={`fa fa-${this.state.open ? 'close' : 'superpowers'}`}/>
                </div>
            </div>
        )
    }

    close() {
        this.setState({
            open: false
        })
    }
}