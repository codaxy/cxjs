import {Widget, VDOM, getContent} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';
import {GroupAdapter} from '../ui/adapter/GroupAdapter';
import {Binding} from '../data/Binding';
import {Selection} from '../ui/selection/Selection';
import {KeyCode} from '../util/KeyCode';
import {scrollElementIntoView} from '../util/scrollElementIntoView';
import {FocusManager, oneFocusOut, offFocusOut, preventFocusOnTouch} from '../ui/FocusManager';
import {isString} from '../util/isString';
import {isArray} from '../util/isArray';

/*
 - renders list of items
 - focusable (keyboard navigation)
 - selection
 - fake focus - list appears focused and receives keyboard inputs redirected from other control (dropdown scenario)
 */


export class List extends Widget {

   init() {
      if (this.recordAlias)
         this.recordName = this.recordAlias;
      
      if (this.indexAlias)
         this.indexName = this.indexAlias;
      
      this.adapter = GroupAdapter.create(this.adapter || GroupAdapter, {
         recordName: this.recordName,
         indexName: this.indexName,
         recordsBinding: this.records && this.records.bind && Binding.get(this.records.bind),
         keyField: this.keyField
      });

      this.child = Widget.create({
         type: PureContainer,
         layout: this.layout,
         items: this.items,
         children: this.children,
         styled: true,
         class: this.itemClass,
         className: this.itemClassName,
         style: this.itemStyle
      });

      delete this.children;

      this.selection = Selection.create(this.selection, {
         records: this.records
      });

      super.init();

      if (this.grouping) {
         this.groupBy(this.grouping)
      }
   }

   declareData() {

      var selection = this.selection.configureWidget(this);

      super.declareData(selection, {
         records: undefined,
         sorters: undefined,
         sortField: undefined,
         sortDirection: undefined,
         filterParams: {
            structured: true
         },
         itemStyle: {
            structured: true
         },
         emptyText: undefined
      }, ...arguments);
   }

   prepareData(context, instance) {
      var {data} = instance;

      if (data.sortField)
         data.sorters = [{
            field: data.sortField,
            direction: data.sortDirection || "ASC"
         }];
      this.adapter.sort(data.sorters);

      let filter = null;
      if (this.onCreateFilter)
         filter = instance.invoke("onCreateFilter", data.filterParams, instance);
      else if (this.filter)
         filter = item => this.filter(item, data.filterParams);
      this.adapter.setFilter(filter);
      instance.mappedRecords = this.adapter.getRecords(context, instance, data.records, instance.store);

      data.stateMods = Object.assign(data.stateMods || {}, {
         selectable: !this.selection.isDummy || this.onItemClick,
         empty: instance.mappedRecords.length == 0
      });

      super.prepareData(context, instance);
   }

   explore(context, instance, data) {
      var instances = [];
      var isSelected = this.selection.getIsSelectedDelegate(instance.store);
      instance.mappedRecords.forEach(record => {
         if (record.type == 'data') {
            var itemInstance = instance.getChild(context, this.child, record.key + ':', record.store);
            itemInstance.record = record;

            if (this.cached && itemInstance.cached && itemInstance.cached.record && itemInstance.cached.record.data == record.data && !itemInstance.childStateDirty) {
               instances.push(itemInstance);
               itemInstance.shouldUpdate = false;
            }
            else if (itemInstance.scheduleExploreIfVisible(context))
               instances.push(itemInstance);

            var selected = isSelected(record.data, record.index);
            if (itemInstance.selected != selected) {
               itemInstance.selected = selected;
               //itemInstance.markShouldUpdate(context);
            }
         }
         else if (record.type == 'group-header' && record.grouping.header) {
            var itemInstance = instance.getChild(context, record.grouping.header, record.key, record.store);
            itemInstance.record = record;
            if (itemInstance.scheduleExploreIfVisible(context))
               instances.push(itemInstance);
         }
         else if (record.type == 'group-footer' && record.grouping.footer) {
            var itemInstance = instance.getChild(context, record.grouping.footer, record.key, record.store);
            itemInstance.record = record;
            if (itemInstance.scheduleExploreIfVisible(context))
               instances.push(itemInstance);
         }
      });
      instance.instances = instances;
   }

   render(context, instance, key) {
      var items = instance.instances.map(x => ({
         instance: x,
         key: x.record.key,
         type: x.record.type,
         content: getContent(x.render(context))
      }));
      return <ListComponent
         key={key}
         instance={instance}
         items={items}
         selectable={!this.selection.isDummy || this.onItemClick}
      />
   }

   groupBy(grouping) {
      if (grouping) {
         if (!isArray(grouping)) {
            if (isString(grouping) || typeof grouping == 'object')
               return this.groupBy([grouping]);
            throw new Error('DynamicGrouping should be an array of grouping objects');
         }

         grouping = grouping.map((g, i) => {
            if (isString(g)) {
               return {
                  key: {
                     [g]: {
                        bind: this.recordName + '.' + g
                     }
                  }
               }
            }
            return g;
         });
      }

      grouping.forEach(g => {
         if (g.header)
            g.header = Widget.create(g.header);

         if (g.footer)
            g.footer = Widget.create(g.footer);
      });

      this.adapter.groupBy(grouping);
      this.update();
   }
}

List.prototype.recordName = '$record';
List.prototype.indexName = '$index';
List.prototype.baseClass = 'list';
List.prototype.focusable = true;
List.prototype.focused = false;
List.prototype.itemPad = true;
List.prototype.cached = false;
List.prototype.styled = true;

Widget.alias('list', List);

class ListComponent extends VDOM.Component {
   constructor(props) {
      super(props);
      var {focused} = props.instance.widget;
      this.state = {
         cursor: focused && props.selectable ? 0 : -1,
         focused: focused
      }
   }

   shouldComponentUpdate(props, state) {
      return props.instance.shouldUpdate || state != this.state;
   }

   componentDidMount() {
      var {instance} = this.props;
      var {widget} = instance;
      if (widget.pipeKeyDown)
         instance.invoke("pipeKeyDown", ::this.handleKeyDown, instance);
   }

   componentWillReceiveProps(props) {
      this.setState({
         cursor: Math.max(Math.min(this.state.cursor, props.items.length - 1), this.state.focused ? 0 : -1)
      });
   }

   componentWillUnmount() {
      var {instance} = this.props;
      var {widget} = instance;
      offFocusOut(this);
      if (widget.pipeKeyDown)
         instance.invoke("pipeKeyDown", null, instance);
   }

   render() {
      var {instance, items, selectable} = this.props;
      var {data, widget} = instance;
      var {CSS, baseClass} = widget;
      var itemStyle = CSS.parseStyle(data.itemStyle);
      this.cursorChildIndex = [];
      let cursorIndex = 0;

      var children = items.length > 0 && items.map((x, i) => {
            let {data, selected} = x.instance;
            let className;

            if (x.type == 'data') {
               let ind = cursorIndex++,
                  onDblClick;

               this.cursorChildIndex.push(i);
               className = CSS.element(baseClass, 'item', {
                  selected: selected,
                  cursor: ind == this.state.cursor,
                  pad: widget.itemPad
               });

               if (widget.onItemDoubleClick)
                  onDblClick = e => { instance.invoke("onItemDoubleClick", e, x.instance)};

               return (
                  <li
                     key={x.key}
                     className={CSS.expand(className, data.classNames)}
                     style={itemStyle}
                     onClick={e => this.handleItemClick(e, x.instance)}
                     onDoubleClick={onDblClick}
                     onMouseEnter={e => {
                        this.moveCursor(ind)
                     }}>
                     {x.content}
                  </li>
               );
            } else {
               return (
                  <li
                     key={x.key}
                     className={CSS.element(baseClass, x.type)}
                  >
                     {x.content}
                  </li>
               );
            }
         });

      if (!children && data.emptyText) {
         children = <li className={CSS.element(baseClass, 'empty-text')}>
            {data.emptyText}
         </li>
      }

      return <ul
         ref={el => {
            this.el = el
         }}
         className={CSS.expand(data.classNames, CSS.state({focused: this.state.focused}))}
         style={data.style}
         tabIndex={widget.focusable && selectable && items.length > 0 ? 0 : null}
         onMouseDown={e=>preventFocusOnTouch(e)}
         onKeyDown={::this.handleKeyDown}
         onMouseLeave={::this.handleMouseLeave}
         onFocus={::this.onFocus}
         onBlur={::this.onBlur}
      >
         {children}
      </ul>;
   }

   moveCursor(index, focused, scrollIntoView) {
      if (!this.props.selectable)
         return;

      if (focused != null && this.state.focused != focused)
         this.setState({
            focused: focused || this.props.instance.widget.focused
         });

      this.setState({
         cursor: index
      }, () => {
         if (scrollIntoView) {
            var item = this.el.children[this.cursorChildIndex[index]];
            scrollElementIntoView(item);
         }
      });
   }

   showCursor(focused) {
      if (this.state.cursor == -1) {
         var firstSelected = this.props.items.findIndex(x => x.instance.selected);
         this.moveCursor(firstSelected != -1 ? firstSelected : 0, focused);
      }
   }


   onFocus() {
      FocusManager.nudge();
      this.showCursor(true);

      var {widget} = this.props.instance;
      if (!widget.focused)
         oneFocusOut(this, this.el, () => {
            this.moveCursor(-1, false);
         });

      this.setState({
         focused: true
      });
   }

   onBlur() {
      FocusManager.nudge();
   }

   handleMouseLeave() {
      if (!this.state.focused)
         this.moveCursor(-1);
   }

   handleItemClick(e, itemInstance) {
      e.stopPropagation();

      let {instance} = this.props;
      var {widget} = instance;

      if (widget.onItemClick && instance.invoke("onItemClick", e, itemInstance) === false)
         return;

      if (!this.props.selectable)
         return;

      var {store, record} = itemInstance;
      var {data, index} = record;

      widget.selection.select(store, data, index, {
         toggle: e.ctrlKey
      });
   }

   handleKeyDown(e) {

      var {instance, items} = this.props;

      if (this.onKeyDown && instance.invoke("onKeyDown", e, instance) === false)
         return;

      switch (e.keyCode) {
         case KeyCode.enter:
            var item = items[this.cursorChildIndex[this.state.cursor]];
            if (item)
               this.handleItemClick(e, item.instance);
            break;

         case KeyCode.down:
            if (this.state.cursor + 1 < this.cursorChildIndex.length) {
               this.moveCursor(this.state.cursor + 1, true, true);
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.up:
            if (this.state.cursor > 0) {
               this.moveCursor(this.state.cursor - 1, true, true);
               e.stopPropagation();
               e.preventDefault();
            }
            break;
      }
   }
}
