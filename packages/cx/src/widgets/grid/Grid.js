import {Widget, VDOM, getContent} from '../../ui/Widget';
import {exploreChildren} from '../../ui/layout/exploreChildren';
import {PureContainer} from '../../ui/PureContainer';
import {HtmlElement} from '../HtmlElement';
import {Binding} from '../../data/Binding';
import {getSelector} from '../../data/getSelector';
import {isSelector} from '../../data/isSelector';
import {Format} from '../../ui/Format';
import {Selection} from '../../ui/selection/Selection';
import {DataAdapter} from '../../ui/adapter/DataAdapter';
import {GroupAdapter} from '../../ui/adapter/GroupAdapter';
import {ResizeManager} from '../../ui/ResizeManager';
import {KeyCode} from '../../util/KeyCode';
import {scrollElementIntoView} from '../../util/scrollElementIntoView';
import {findScrollableParent} from '../../util/findScrollableParent'
import {FocusManager, oneFocusOut, offFocusOut} from '../../ui/FocusManager';
import DropDownIcon from '../icons/sort-asc';
import {
   ddMouseDown,
   ddMouseUp,
   ddDetect,
   initiateDragDrop,
   registerDropZone,
   isDragHandleEvent
} from '../drag-drop/ops';

import {GridCell} from './GridCell';
import {GridRow, GridRowComponent} from './GridRow';
import {Localization} from '../../ui/Localization';

export class Grid extends Widget {

   declareData() {

      let selection = this.selection.configureWidget(this);

      super.declareData({
         records: undefined,
         class: {structured: true},
         className: {structured: true},
         style: {structured: true},
         sorters: undefined,
         scrollable: undefined,
         sortField: undefined,
         sortDirection: undefined,
         emptyText: undefined,
         dragSource: {structured: true},
         dropZone: {structured: true}
      }, selection, ...arguments);
   }

   init() {

      if (this.records && this.records.bind)
         this.recordsBinding = Binding.get(this.records.bind);

      let columns = this.columns;

      this.columns = Widget.create(GridColumn, this.columns || [], {
         recordName: this.recordName
      });

      this.columns.forEach(c => c.init());

      let aggregates = {};
      this.columns.filter(c => c.aggregate && c.aggregateField).forEach(c => {
         aggregates[c.aggregateField] = {
            value: c.value != null ? c.value : {bind: this.recordName + '.' + c.field},
            weight: c.weight != null ? c.weight : c.weightField && {bind: this.recordName + '.' + c.weightField},
            type: c.aggregate
         }
      });

      //add default footer if some columns have aggregates and grouping is not defined
      if (!this.grouping && Object.keys(aggregates).length > 0)
         this.grouping = [{
            key: {},
            showFooter: true
         }];


      this.dataAdapter = DataAdapter.create({
         type: (this.dataAdapter && this.dataAdapter.type) || GroupAdapter,
         recordsBinding: this.recordsBinding,
         keyField: this.keyField,
         aggregates: aggregates,
         recordName: this.recordName
      }, this.dataAdapter);

      this.selection = Selection.create(this.selection, {
         records: this.records
      });

      if (!this.selection.isDummy)
         this.selectable = true;

      super.init();

      this.row = Widget.create(GridRow, {
         class: this.CSS.element(this.baseClass, 'data'),
         className: this.rowClass,
         style: this.rowStyle,
         items: Widget.create(GridCell, columns || [], {
            recordName: this.recordName
         })
      });

      if (this.grouping) {
         this.groupBy(this.grouping)
      }
   }

   initState(context, instance) {
      instance.state = {};
   }

   prepareData(context, instance) {

      let {data, state} = instance;

      if (state.sorters && !data.sorters)
         data.sorters = state.sorters;

      if (data.sortField && data.sortDirection)
         data.sorters = [{
            field: data.sortField,
            direction: data.sortDirection
         }];

      if ((!data.sorters || data.sorters.length == 0) && this.defaultSortField)
         data.sorters = [{
            field: this.defaultSortField,
            direction: this.defaultSortDirection || 'ASC'
         }];

      let headerMode = this.headerMode;

      if (this.headerMode == null) {
         if (this.scrollable || this.columns.some(x => x.sortable))
            headerMode = "default";
         else
            headerMode = 'plain';
      }

      let border = this.border;

      if (this.showBorder || (border == null && this.scrollable))
         border = true;

      let dragMode = false;
      if (data.dragSource)
         dragMode = data.dragSource.mode || 'move';

      let dropMode = data.dropZone && data.dropZone.mode;

      if (this.onDrop && !dropMode)
         dropMode = 'preview';

      data.dropMode = dropMode;

      data.stateMods = {
         selectable: this.selectable,
         scrollable: data.scrollable,
         ['header-' + headerMode]: true,
         border: border,
         vlines: this.vlines,
         ['drag-' + dragMode]: dragMode,
         ['drop-' + dropMode]: dropMode
      };

      super.prepareData(context, instance);

      instance.records = this.mapRecords(context, instance);
   }

   initInstance(context, instance) {
      instance.refs = {
         header: {},
         fixed: {}
      };

      super.initInstance(context, instance);
   }

   explore(context, instance) {
      super.explore(context, instance);


      let columns = exploreChildren(context, instance, this.columns, instance.columns);
      if (columns != instance.columns) {
         instance.columns = columns;
         instance.shouldUpdate = true;
      }

      let {store} = instance;
      instance.isSelected = this.selection.getIsSelectedDelegate(store);

      //do not process rows in cached mode if nothing has changed;
      if (!this.cached || instance.shouldUpdate) {
         let dragHandles = context.dragHandles,
            record,
            wasSelected;

         for (let i = 0; i < instance.records.length; i++) {
            record = instance.records[i];
            if (record.type == 'data') {
               let row = record.row = instance.getChild(context, this.row, record.key, record.store);
               wasSelected = row.selected;
               row.selected = instance.isSelected(record.data, record.index);
               if (this.cached && row.cached && row.cached.record && row.cached.record.data == record.data) {
                  row.shouldUpdate = false;
               } else {
                  context.dragHandles = [];
                  row.explore(context);
                  row.shouldUpdate |= wasSelected != record.selected;
                  row.dragHandles = context.dragHandles;
               }
            }
         }

         context.dragHandles = dragHandles;
      }
   }

   prepare(context, instance) {
      if (!this.cached || instance.shouldUpdate) {
         for (let i = 0; i < instance.records.length; i++) {
            let record = instance.records[i];
            if (record.row && (record.row.shouldUpdate || !this.cached))
               record.row.prepare(context);
         }
      }
      instance.columns.forEach(c => c.prepare(context));
      super.prepare(context, instance);
   }

   cleanup(context, instance) {
      if (!this.cached || instance.shouldUpdate) {
         for (let i = 0; i < instance.records.length; i++) {
            let record = instance.records[i];
            if (record.row && (record.row.shouldUpdate || !this.cached)) {
               record.row.cleanup(context);
               record.row.cached.record = record;
            }
         }
      }
      instance.columns.forEach(c => c.cleanup(context));
      super.cleanup(context, instance);
   }

   groupBy(grouping, {autoConfigure} = {}) {
      if (grouping) {
         if (!Array.isArray(grouping)) {
            if (typeof grouping == 'string' || typeof grouping == 'object')
               return this.groupBy([grouping]);
            throw new Error('DynamicGrouping should be an array or grouping objects');
         }

         grouping = grouping.map((g, i) => {
            if (typeof g == 'string') {
               return {
                  key: {
                     [g]: {
                        bind: this.recordName + '.' + g
                     }
                  },
                  showHeader: i == grouping.length - 1,
                  showFooter: true,
                  caption: {tpl: '{$group.' + g + '}'},
                  text: {tpl: '{$record.' + g + '}'}
               }
            }
            return g;
         });

         initGrouping(grouping);
      }

      if (autoConfigure)
         this.showHeader = !Array.isArray(grouping) || !grouping.some(g => g.showHeader);

      this.dataAdapter.groupBy(grouping);
      this.update();
   }

   render(context, instance, key) {
      let {data, refs} = instance;


      let fixedHeader = data.scrollable && this.showHeader && this.renderHeader(context, instance, 'header', {
            fixed: true,
            refs: refs.fixed,
            originalRefs: refs.header
         });

      this.renderRows(context, instance);

      refs.header = {};
      let header = this.showHeader && this.renderHeader(context, instance, 'header', {refs: refs.header});

      return (
         <GridComponent
            key={key}
            instance={instance}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
            header={header}
            headerRefs={refs.header}
            fixedHeader={fixedHeader}
            fixedHeaderRefs={refs.fixed}/>
      )
   }

   renderHeader(context, instance, key, {fixed, refs, originalRefs}) {
      let {data, widget} = instance;
      if (!refs)
         refs = {};
      let {CSS, baseClass} = widget;

      let result = [[], [], []];
      let skip = {};

      let empty = [true, true, true];

      instance.columns.forEach((columnInstance, i) => {

         let c = columnInstance.widget;

         for (let l = 0; l < 3; l++) {

            let colKey = `${i}-${l}`;

            if (skip[colKey])
               continue;

            let header = columnInstance[`header${l + 1}`];
            let colSpan, rowSpan, style, cls, mods = [], content, sortIcon, tool;

            if (header) {
               empty[l] = false;

               if (header.widget.align)
                  mods.push('aligned-' + header.widget.align);
               else if (c.align)
                  mods.push('aligned-' + c.align);

               if (c.sortable && header.widget.allowSorting) {
                  mods.push('sortable');

                  if (data.sorters && data.sorters[0].field == (c.sortField || c.field)) {
                     mods.push('sorted-' + data.sorters[0].direction.toLowerCase());
                     sortIcon = <DropDownIcon className={CSS.element(baseClass, 'column-sort-icon')}/>
                  }
               }

               style = header.data.style;
               if (header.data.classNames)
                  cls = header.data.classNames;

               content = header.render(context);

               if (header.components && header.components.tool) {
                  tool = <div
                     className={CSS.element(baseClass, 'col-header-tool')}>{getContent(header.components.tool.render(context))}
                  </div>;
                  mods.push('tool');
               }

               if (fixed && originalRefs[colKey]) {
                  style = {...style, width: originalRefs[colKey].offsetWidth + 'px'}
               }

               if (header.data.colSpan > 1 || header.data.rowSpan > 1) {
                  colSpan = header.data.colSpan;
                  rowSpan = header.data.rowSpan;

                  for (let r = 0; r < header.data.rowSpan; r++)
                     for (let c = 0; c < header.data.colSpan; c++)
                        skip[`${i + c}-${l + r}`] = true;
               }
            }

            cls = CSS.element(baseClass, 'col-header', mods) + (cls ? ' ' + cls : '');

            result[l].push(<th key={i}
               ref={c => {
                  refs[colKey] = c
               }}
               colSpan={colSpan}
               rowSpan={rowSpan}
               className={cls}
               style={style}
               onClick={e => this.onHeaderClick(e, c, instance, l)}
            >
               {getContent(content)}
               {sortIcon}
               {tool}
            </th>);
         }
      });

      result = result.filter((_, i) => !empty[i]);

      if (fixed)
         result[0].push(<th key="dummy"
            rowSpan={result.length}
            className={CSS.element(baseClass, "col-header")}
            ref={el => {
               refs.last = el
            }}/>);

      return <tbody key={'h' + key} className={CSS.element(baseClass, 'header')}>
      {result.map((h, i) => <tr key={i}>{h}</tr>)}
      </tbody>;
   }

   onHeaderClick(e, column, instance, headerLine) {
      e.preventDefault();
      e.stopPropagation();

      let {data} = instance;
      let header = column[`header${headerLine + 1}`];

      if (header.allowSorting && column.sortable && (column.field || column.sortField || column.value)) {
         let sortField = column.sortField || column.field;
         let dir = 'ASC';
         if (data.sorters && data.sorters[0].field == sortField && (data.sorters[0].value == column.value || data.sortField) && data.sorters[0].direction == 'ASC')
            dir = 'DESC';

         let sorters = [{
            field: sortField,
            direction: dir,
            value: column.value
         }];

         instance.set('sorters', sorters);
         instance.set('sortField', sortField);
         instance.set('sortDirection', dir);

         if (!this.remoteSort)
            instance.setState({sorters});
      }
   }

   renderGroupHeader(context, instance, g, level, group, i, store) {
      let {CSS, baseClass} = this;
      let data = store.getData();
      let caption = g.caption(data);
      return <tbody key={`g-${level}-${i}`} className={CSS.element(baseClass, 'group-caption', ['level-' + level])}>
      <tr>
         <td colSpan={instance.columns.length}>{caption}</td>
      </tr>
      </tbody>;
   }

   renderGroupFooter(context, instance, g, level, group, i, store) {
      let {CSS, baseClass} = this;
      let data = store.getData();
      return <tbody key={'f' + i} className={CSS.element(baseClass, 'group-footer', ['level-' + level])}>
      <tr>
         {
            instance.columns.map((ci, i) => {
               let v, c = ci.widget;
               if (c.footer)
                  v = c.footer(data);
               else if (c.aggregate && c.aggregateField) {
                  v = group[c.aggregateField];
                  if (typeof ci.data.format == 'string')
                     v = Format.value(v, ci.data.format);
               }

               let cls = '';
               if (c.align)
                  cls += CSS.state('aligned-' + c.align);
               return <td key={i} className={cls}>{v}</td>;
            })
         }
      </tr>
      </tbody>;
   }

   renderRows(context, instance) {

      let {records} = instance;

      if (!Array.isArray(records))
         return null;

      let record, g;

      for (let i = 0; i < records.length; i++) {
         record = records[i];
         if (record.type == 'data')
            record.vdom = getContent(record.row.render(context, record.key));

         if (record.type == 'group-header') {
            record.vdom = [];
            g = record.grouping;
            if (g.caption)
               record.vdom.push(this.renderGroupHeader(context, instance, g, record.level, record.group, record.key + '-caption', record.store));

            if (g.showHeader)
               record.vdom.push(this.renderHeader(context, instance, record.key + '-header', {}));
         }

         if (record.type == 'group-footer') {
            g = record.grouping;
            if (g.showFooter)
               record.vdom = this.renderGroupFooter(context, instance, g, record.level, record.group, record.key + '-footer', record.store);
         }
      }
   }

   mapRecords(context, instance) {
      let {data, store} = instance;
      this.dataAdapter.sort(!this.remoteSort && data.sorters);
      return this.dataAdapter.getRecords(context, instance, data.records, store);
   }
}

Grid.prototype.baseClass = 'grid';
Grid.prototype.showHeader = true;
Grid.prototype.showFooter = false;
Grid.prototype.recordName = '$record';
Grid.prototype.remoteSort = false;
Grid.prototype.lockColumnWidths = false;
Grid.prototype.lockColumnWidthsRequiredRowCount = 3;
Grid.prototype.focused = false;
Grid.prototype.emptyText = false;
Grid.prototype.showBorder = false; // show border override for material theme
Grid.prototype.cached = false;

Widget.alias('grid', Grid);
Localization.registerPrototype('cx/widgets/Grid', Grid);

class GridComponent extends VDOM.Component {
   constructor(props) {
      super(props);
      this.dom = {};
      let {widget} = props.instance;
      this.state = {
         cursor: widget.focused && widget.selectable ? 0 : -1,
         focused: widget.focused,
         dragInsertionIndex: null
      }
   }

   render() {
      let {instance, data} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;
      let {dragSource} = data;

      let children = [];
      instance.records.forEach((record, i) => {
         if (record.type == 'data') {
            let {data, store, index, key, row} = record;
            let dragged = this.state.dragged && (row.selected || record == this.state.dragged);
            let mod = {
               selected: row.selected,
               dragged: dragged,
               draggable: dragSource && row.dragHandles.length == 0,
               cursor: i == this.state.cursor
            };

            children.push(
               <GridRowComponent
                  key={key}
                  className={CSS.expand(row.data.classNames, CSS.state(mod))}
                  store={store}
                  dragSource={dragSource}
                  instance={row}
                  grid={instance}
                  record={record}
                  parent={this}
                  onMouseEnter={e => this.moveCursor(i)}
                  selected={row.selected}
                  isBeingDragged={dragged}
                  cursor={mod.cursor}
                  shouldUpdate={row.shouldUpdate}
               >
                  {record.vdom}
               </GridRowComponent>
            );
         }
         else
            children.push(record.vdom);
      });

      if (this.state.dragInsertionIndex != null) {
         let dragInsertionRow = (
            <tbody key="dropzone">
            <tr>
               <td
                  className={CSS.element(baseClass, 'dropzone')}
                  colSpan={1000}
                  style={{
                     height: data.dropMode == 'insertion' ? 0 : this.state.dragItemHeight,
                  }}>
               </td>
            </tr>
            </tbody>
         );
         children.splice(this.state.dragInsertionIndex, 0, dragInsertionRow);
      }

      let content = [];

      if (instance.records.length == 0 && data.emptyText) {
         content.push(
            <div
               key="empty"
               className={CSS.element(baseClass, 'empty-text')}
            >
               {data.emptyText}
            </div>
         );
      } else {
         content.push(
            <div
               key="scroller"
               ref={el => {
                  this.dom.scroller = el
               }}
               tabIndex={widget.selectable ? 0 : null}
               onScroll={::this.onScroll}
               className={CSS.element(baseClass, 'scroll-area')}
               onKeyDown={::this.handleKeyDown}
               onMouseLeave={::this.handleMouseLeave}
               onFocus={::this.onFocus}
               onBlur={::this.onBlur}
            >
               <table
                  ref={el => {
                     this.dom.table = el
                  }}
               >
                  {this.props.header}
                  {children}
               </table>
            </div>
         );

         if (this.props.fixedHeader)
            content.push(<div key="fh"
               ref={el => {
                  this.dom.fixedHeader = el
               }}
               className={CSS.element(baseClass, 'fixed-header')}
               style={{display: this.scrollWidth > 0 ? 'block' : 'none'}}>
               <table>
                  {this.props.fixedHeader}
               </table>
            </div>);
      }

      return <div className={data.classNames}
         style={data.style}>
         {content}
      </div>
   }

   onScroll(e) {
      if (this.dom.fixedHeader) {
         this.dom.fixedHeader.scrollLeft = e.target.scrollLeft;
      }
   }

   shouldComponentUpdate(props, state) {
      return props.shouldUpdate !== false || state != this.state;
   }

   componentDidMount() {
      this.componentDidUpdate();
      let {widget} = this.props.instance;
      if (widget.scrollable)
         this.offResize = ResizeManager.subscribe(::this.componentDidUpdate);
      if (widget.pipeKeyDown)
         widget.pipeKeyDown(::this.handleKeyDown, this.props.instance);
      this.unregisterDropZone = registerDropZone(this);
   }

   onDragStart(e) {
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.onDragStart)
         widget.onDragStart(e, instance);
   }

   onDrop(e) {
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.onDrop) {
         e.target = {
            insertionIndex: this.state.dragInsertionIndex
         };
         widget.onDrop(e, instance);
      }
   }

   onDropTest(e) {
      let {widget} = this.props.instance;
      if (widget.onDropTest)
         return widget.onDropTest(e);
      return true;
   }

   onDragEnd(e) {
      this.setState({
         dragInsertionIndex: null,
         lastDragInsertionIndex: null
      });
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.onDragEnd)
         widget.onDragEnd(e, instance);
   }

   onDragMeasure(e) {
      let r = this.dom.scroller.getBoundingClientRect();
      let {clientX, clientY} = e.cursor;

      if (clientX < r.left || clientX >= r.right || clientY < r.top || clientY >= r.bottom)
         return false;

      return {
         over: 1000
      };
   }

   onDragOver(ev) {
      let {CSS, baseClass} = this.props.instance.widget;
      let rowClass = CSS.element(baseClass, 'data');
      let nodes = Array.from(this.dom.scroller.firstChild.childNodes)
         .filter(node => node.className && node.className.indexOf(rowClass) != -1);

      let cy = ev.cursor.clientY;
      let s = 0, e = nodes.length, m, b;

      while (s < e) {
         m = Math.floor((s + e) / 2);
         b = nodes[m].getBoundingClientRect();

         //dragged items might be invisible and do not offer
         if (b.top == 0 && b.bottom == 0) {
            if (m > s)
               m--;
            else if (m + 1 < e)
               m = m + 1;
            else {
               s = e = m;
               break;
            }
            b = nodes[m].getBoundingClientRect();
         }

         if (cy < b.top)
            e = m;
         else if (cy > b.bottom)
            s = m + 1;
         else {
            if (cy > (b.bottom + b.top) / 2)
               s = e = m + 1;
            else {
               s = e = m;
            }
         }
      }

      if (s != this.state.dragInsertionIndex) {
         this.setState({
            dragInsertionIndex: s,
            dragItemHeight: ev.source.height - 1
         });
      }
   }

   onDragLeave(e) {
      this.setState({
         dragInsertionIndex: null
      });
   }

   onGetHScrollParent() {
      let {widget} = this.props.instance;
      if (widget.scrollable)
         return this.dom.scroller;
      return findScrollableParent(this.el, true);
   }

   onGetVScrollParent() {
      let {widget} = this.props.instance;
      if (widget.scrollable)
         return this.dom.scroller;
      return findScrollableParent(this.el);
   }

   componentWillReceiveProps(props) {
      let {records, widget} = props.instance;
      this.setState({
         cursor: Math.max(Math.min(this.state.cursor, records.length - 1), widget.selectable && this.state.focused ? 0 : -1)
      });
   }

   componentWillUnmount() {
      let {instance} = this.props;
      let {widget} = instance;
      if (this.offResize)
         this.offResize();

      offFocusOut(this);

      if (this.unregisterDropZone)
         this.unregisterDropZone();

      if (widget.pipeKeyDown)
         widget.pipeKeyDown(null, instance);
   }

   componentDidUpdate() {
      let {headerRefs, fixedHeaderRefs, instance, data}= this.props;
      let {widget} = instance;

      if (widget.scrollable) {
         this.scrollWidth = this.dom.scroller.offsetWidth - this.dom.scroller.clientWidth;
         if (widget.lockColumnWidths && headerRefs && Array.isArray(data.records) && data.records.length >= widget.lockColumnWidthsRequiredRowCount) {
            for (let k in headerRefs) {
               let c = headerRefs[k];
               c.style.width = c.offsetWidth + 'px';
            }
         }
         if (this.dom.fixedHeader) {
            for (let k in headerRefs) {
               let c = headerRefs[k];
               let fhe = fixedHeaderRefs[k];
               if (fhe) {
                  fhe.style.width = fhe.style.minWidth = fhe.style.maxWidth = c.offsetWidth + 'px';
               }
            }
            this.dom.fixedHeader.style.display = 'block';
            fixedHeaderRefs.last.style.width = fixedHeaderRefs.last.style.minWidth = this.scrollWidth + 'px';

            let headerHeight = this.dom.fixedHeader.offsetHeight;
            this.dom.table.style.marginTop = `${-headerHeight}px`;
            this.dom.scroller.style.marginTop = `${headerHeight}px`;
         }
      }
   }

   moveCursor(index, focused, scrollIntoView) {
      if (!this.props.instance.widget.selectable)
         return;

      if (focused != null && this.state.focused != focused)
         this.setState({
            focused: focused || this.props.instance.widget.focused
         });

      this.setState({
         cursor: index
      }, () => {
         if (scrollIntoView) {
            let item = this.dom.scroller.firstChild.children[index + 1];
            scrollElementIntoView(item);
         }
      });
   }

   showCursor(focused) {
      if (this.state.cursor == -1) {
         let {records, isSelected} = this.props.instance;
         let cursor = records.findIndex(x => isSelected(x.data, x.index));
         //if there are no selected records, find the first data record (skip group header)
         if (cursor == -1)
            cursor = records.findIndex(x => x.type == 'data');
         this.moveCursor(cursor);
      }
   }

   onFocus() {
      FocusManager.nudge();
      this.showCursor(true);

      let {widget} = this.props.instance;
      if (!widget.focused)
         oneFocusOut(this, this.dom.scroller, () => {
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

   handleKeyDown(e) {

      let {instance} = this.props;
      let {records, widget} = instance;

      if (this.onKeyDown && this.onKeyDown(e, instance) === false)
         return;

      switch (e.keyCode) {
         case KeyCode.enter:
            let record = records[this.state.cursor];
            if (record)
               widget.selection.select(instance.store, record.data, record.index, {
                  toggle: e.ctrlKey
               });
            break;

         case KeyCode.down:
            if (this.state.cursor + 1 < records.length) {
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

   beginDragDrop(e, record) {

      let {instance, data} = this.props;
      let {widget, store} = instance;
      let {CSS, baseClass} = widget;

      let isSelected = widget.selection.getIsSelectedDelegate(store);

      let selected = instance.records.filter(record => isSelected(record.data, record.index));

      if (selected.length == 0)
         selected = [record];

      let contents = selected
         .map((record, i) => (
            <tbody
               key={i}
               className={CSS.element(baseClass, 'data', {selected: !widget.selection.isDummy})}
            >
            {record.vdom}
            </tbody>
         ));

      initiateDragDrop(e, {
         sourceEl: e.currentTarget,
         source: {
            data: data.dragSource.data,
            store: store,
            record: record,
            records: selected
         },
         clone: {
            store: record.store,
            widget: props => (
               <div className={data.classNames}>
                  <table>
                     {contents}
                  </table>
               </div>
            )
         }
      }, () => {
         this.setState({
            dragged: false
         })
      });

      this.setState({
         dragged: record
      })
   }
}

class GridColumn extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         value: undefined,
         weight: undefined,
         pad: undefined,
         format: undefined
      })
   }

   init() {

      if (typeof this.header != 'undefined')
         this.header1 = this.header;

      if (this.header1 && isSelector(this.header1))
         this.header1 = {
            text: this.header1 || ''
         };

      if (this.header1 && this.header1)
         this.header1 = Widget.create(GridColumnHeader, this.header1);

      if (this.header2 && isSelector(this.header2))
         this.header2 = {
            text: this.header2 || ''
         };

      if (this.header2)
         this.header2 = Widget.create(GridColumnHeader, this.header2);

      if (this.header3 && isSelector(this.header3))
         this.header3 = {
            text: this.header3 || ''
         };

      if (this.header3)
         this.header3 = Widget.create(GridColumnHeader, this.header3);

      if (!this.value && this.field)
         this.value = {bind: this.recordName + '.' + this.field};

      if (!this.aggregateField && this.field)
         this.aggregateField = this.field;

      if (this.footer != null)
         this.footer = getSelector(this.footer);

      super.init();
   }

   initInstance(context, instance) {
      instance.header1 = this.header1 && instance.getChild(context, this.header1);
      instance.header2 = this.header2 && instance.getChild(context, this.header2);
      instance.header3 = this.header3 && instance.getChild(context, this.header3);
   }

   explore(context, instance) {
      if (instance.repeatable)
         super.explore(context, instance);
      else {
         if (instance.header1)
            instance.header1.explore(context);
         if (instance.header2)
            instance.header2.explore(context);
         if (instance.header3)
            instance.header3.explore(context);
      }
   }

   prepare(context, instance) {
      if (instance.repeatable)
         super.prepare(context, instance);
      else {
         if (instance.header1)
            instance.header1.prepare(context);
         if (instance.header2)
            instance.header2.prepare(context);
         if (instance.header3)
            instance.header3.prepare(context);
      }
   }

   cleanup(context, instance) {
      if (instance.repeatable)
         super.cleanup(context, instance);
      else {
         if (instance.header1)
            instance.header1.cleanup(context);
         if (instance.header2)
            instance.header2.cleanup(context);
         if (instance.header3)
            instance.header3.cleanup(context);
      }
   }
}

class GridColumnHeader extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         text: undefined,
         style: {structured: true},
         class: {structured: true},
         className: {structured: true},
         colSpan: undefined,
         rowSpan: undefined
      })
   }

   initComponents() {
      return super.initComponents(...arguments, {
         tool: this.tool && Widget.create(this.tool)
      })
   }

   render(context, instance, key) {
      let {data} = instance;
      return data.text || super.render(context, instance, key);
   }
}

GridColumnHeader.prototype.colSpan = 1;
GridColumnHeader.prototype.rowSpan = 1;
GridColumnHeader.prototype.allowSorting = true;

function initGrouping(grouping) {
   grouping.forEach(g => {
      if (g.caption)
         g.caption = getSelector(g.caption);
   })
}



