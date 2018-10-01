import {Widget, VDOM, getContent} from '../../ui/Widget';
import {PureContainer} from '../../ui/PureContainer';
import {Binding, isBinding} from '../../data/Binding';
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
   initiateDragDrop,
   registerDropZone,
} from '../drag-drop/ops';

import {GridRow, GridRowComponent} from './GridRow';
import {Localization} from '../../ui/Localization';
import {SubscriberList} from '../../util/SubscriberList';
import {RenderingContext} from '../../ui/RenderingContext';
import {isNonEmptyArray} from '../../util/isNonEmptyArray';
import {isObject} from "../../util/isObject";
import {isString} from '../../util/isString';
import {isDefined} from '../../util/isDefined';
import {isArray} from '../../util/isArray';
import {isNumber} from '../../util/isNumber';
import {debounce} from '../../util/debounce';
import {shallowEquals} from '../../util/shallowEquals';
import {InstanceCache} from "../../ui/Instance";
import {Cx} from '../../ui/Cx';
import {Console} from "../../util/Console";
import {getTopLevelBoundingClientRect} from "../../util/getTopLevelBoundingClientRect";
import {getParentFrameBoundingClientRect} from "../../util/getParentFrameBoundingClientRect";
import {ValidationGroup} from "../form/ValidationGroup";


export class Grid extends Widget {

   declareData() {

      let selection = this.selection.configureWidget(this);

      super.declareData({
         records: undefined,
         sorters: undefined,
         scrollable: undefined,
         sortField: undefined,
         sortDirection: undefined,
         emptyText: undefined,
         dragSource: {structured: true},
         dropZone: {structured: true},
         filterParams: {structured: true},
         groupingParams: {structured: true},
         page: undefined,
         totalRecordCount: undefined,
      }, selection, ...arguments);
   }

   init() {

      if (this.recordAlias)
         this.recordName = this.recordAlias;

      if (this.indexAlias)
         this.indexName = this.indexAlias;

      if (this.infinite) {
         this.buffered = true;
         this.remoteSort = true;
      }

      if (this.buffered)
         this.scrollable = true;

      if (isBinding(this.records))
         this.recordsBinding = Binding.get(this.records.bind);

      if (!this.row)
         this.row = {};

      if (this.columns)
         this.row.line1 = {
            columns: this.columns
         };

      this.hasSortableColumns = false;
      let aggregates = {};
      let lines = [];
      for (let i = 0; i < 10; i++) {
         let l = this.row['line' + i];
         if (l) {
            lines.push(l);
         }
      }

      this.header = PureContainer.create({
         items: GridColumnHeaderLine.create(lines)
      });

      this.header.items.forEach(line => {
         line.items.forEach(c => {
            if (c.sortable)
               this.hasSortableColumns = true;

            if (c.aggregate && (c.aggregateField || isDefined(c.aggregateValue))) {
               aggregates[c.aggregateAlias] = {
                  value: isDefined(c.aggregateValue)
                     ? c.aggregateValue
                     : isDefined(c.value)
                        ? c.value
                        : c.aggregateField
                           ? {bind: this.recordName + '.' + c.aggregateField}
                           : null,
                  weight: c.weight != null ? c.weight : c.weightField && {bind: this.recordName + '.' + c.weightField},
                  type: c.aggregate
               }
            }
         })
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
         recordName: this.recordName,
         indexName: this.indexName
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
         recordName: this.recordName,
         ...this.row
      });

      if (this.grouping) {
         this.groupBy(this.grouping)
      }
   }

   initState(context, instance) {
      instance.state = {};
      instance.v = 0;
      if (this.infinite)
         instance.buffer = {
            records: [],
            totalRecordCount: 0,
            page: 1
         }
   }

   prepareData(context, instance) {

      let {data, state, cached} = instance;

      data.version = ++instance.v;

      if (!this.infinite)
         data.totalRecordCount = isArray(data.records) ? data.records.length : 0;
      else {
         if (isNumber(data.totalRecordCount))
            instance.buffer.totalRecordCount = data.totalRecordCount;
         else
            data.totalRecordCount = instance.buffer.totalRecordCount;

         if (isDefined(data.records))
            instance.buffer.records = data.records;
         else
            data.records = instance.buffer.records;

         if (isNumber(data.page))
            instance.buffer.page = data.page;
         else
            data.page = instance.buffer.page;

         data.offset = (data.page - 1) * this.pageSize;
      }

      if (!isArray(data.records))
         data.records = [];

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
         if (this.scrollable || this.hasSortableColumns)
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
         "cell-editable": this.cellEditable,
         scrollable: data.scrollable,
         buffered: this.buffered,
         ['header-' + headerMode]: true,
         border: border,
         vlines: this.vlines,
         ['drag-' + dragMode]: dragMode,
         ['drop-' + dropMode]: dropMode
      };

      super.prepareData(context, instance);

      if (this.onGetGrouping && (!cached.data || cached.data.groupingParams !== data.groupingParams)) {
         let grouping = instance.invoke("onGetGrouping", data.groupingParams, instance);
         this.groupBy(grouping, {autoConfigure: true})
      }

      instance.records = this.mapRecords(context, instance);

      //tree adapters can have additional (child) records
      if (instance.records && instance.records.length > data.totalRecordCount && !isNonEmptyArray(this.grouping))
         data.totalRecordCount = instance.records.length;
   }

   initInstance(context, instance) {
      instance.fixedHeaderResizeEvent = new SubscriberList();
      this.dataAdapter.initInstance(context, instance);
      super.initInstance(context, instance);
   }

   initComponents(context, instance) {
      return super.initComponents(...arguments, {
         header: this.header
      });
   }

   explore(context, instance) {

      context.push('parentPositionChangeEvent', instance.fixedHeaderResizeEvent);

      super.explore(context, instance);

      let {store} = instance;
      instance.isSelected = this.selection.getIsSelectedDelegate(store);

      //do not process rows in buffered mode or cached mode if nothing has changed;
      if (!this.buffered && (!this.cached || instance.shouldUpdate)) {
         for (let i = 0; i < instance.records.length; i++) {
            let record = instance.records[i];
            if (record.type == 'data') {
               let row = record.row = instance.getChild(context, this.row, record.key, record.store);
               let selected = instance.isSelected(record.data, record.index);
               let changed = false;
               if (row.cache('selected', row.selected))
                  changed = true;
               if (row.cache('recordData', record.data))
                  changed = true;
               row.selected = selected;
               if (this.cached && !changed && !row.childStateDirty) {
                  row.shouldUpdate = false;
               }
               else
                  row.scheduleExploreIfVisible(context);
            }
         }
      }
   }

   exploreCleanup(context, instance) {
      context.pop('parentPositionChangeEvent');
   }

   applyGrouping(grouping, {autoConfigure} = {}) {
      if (grouping) {
         if (!isArray(grouping)) {
            if (isString(grouping) || isObject(grouping))
               return this.groupBy([grouping]);
            throw new Error('DynamicGrouping should be an array or grouping objects');
         }

         grouping = grouping.map((g, i) => {
            if (isString(g)) {
               return {
                  key: {
                     [g]: {
                        bind: this.recordName + '.' + g
                     }
                  },
                  showHeader: !this.scrollable && i == grouping.length - 1,
                  showFooter: true,
                  caption: {bind: `$group.${g}`},
                  text: {bind: `${this.recordName}.${g}`}
               }
            }
            return g;
         });

         initGrouping(grouping);
      }

      if (autoConfigure)
         this.showHeader = this.scrollable || !isArray(grouping) || !grouping.some(g => g.showHeader);

      if (!this.dataAdapter.groupBy) {
         Console.warn("Configured grid data adapter does not support grouping. Grouping instructions are ignored.")
         return;
      }

      this.dataAdapter.groupBy(grouping);

   }

   groupBy(grouping, options) {
      this.applyGrouping(grouping, options);
      this.update();
   }

   render(context, instance, key) {
      let {data} = instance;


      let fixedHeader = data.scrollable && this.showHeader && this.renderHeader(context, instance, 'header', true);

      if (!this.buffered)
         this.renderRows(context, instance);

      let header = this.showHeader && this.renderHeader(context, instance, 'header');

      let fixedFooter = false;

      if (instance.footerVDOM) {
         fixedFooter = instance.footerVDOM;
      }

      return (
         <GridComponent
            key={key}
            instance={instance}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
            header={header}
            fixedHeader={fixedHeader}
            fixedFooter={fixedFooter}
         />
      )
   }

   renderHeader(context, instance, key, fixed) {
      let {data, widget, components} = instance;
      let {header} = components;

      let {CSS, baseClass} = widget;

      let headerRows = [];

      if (!header)
         return null;

      let skip = {};

      header.children.forEach((line, lineIndex) => {
         let empty = [true, true, true];
         let result = [[], [], []];


         line.children.forEach((columnInstance, i) => {
            let c = columnInstance.widget;
            for (let l = 0; l < 3; l++) {

               let colKey = `${lineIndex}-${i}-${l}`;

               if (skip[colKey])
                  continue;

               let header = columnInstance.components[`header${l + 1}`];
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

                  if (header.data.colSpan > 1 || header.data.rowSpan > 1) {
                     colSpan = header.data.colSpan;
                     rowSpan = header.data.rowSpan;

                     for (let r = 0; r < header.data.rowSpan; r++)
                        for (let c = 0; c < header.data.colSpan; c++)
                           skip[`${lineIndex}-${i + c}-${l + r}`] = true;
                  }
               }

               cls = CSS.element(baseClass, 'col-header', mods) + (cls ? ' ' + cls : '');

               let onContextMenu;

               if (this.onColumnContextMenu)
                  onContextMenu = e => instance.invoke('onColumnContextMenu', e, columnInstance);

               result[l].push(<th
                  key={i}
                  colSpan={colSpan}
                  rowSpan={rowSpan}
                  className={cls}
                  style={style}
                  onClick={e => this.onHeaderClick(e, c, instance, l)}
                  onContextMenu={onContextMenu}
               >
                  {getContent(content)}
                  {sortIcon}
                  {tool}
               </th>);
            }
         });

         result = result.filter((_, i) => !empty[i]);

         if (result[0]) {
            if (fixed) {
               result[0].push(<th
                  key="dummy"
                  rowSpan={result.length}
                  className={CSS.element(baseClass, "col-header")}
               />);
            }

            headerRows.push(
               <tbody key={'h' + key + lineIndex} className={CSS.element(baseClass, 'header')}>
               {result.map((h, i) => <tr key={i}>{h}</tr>)}
               </tbody>
            );
         }
      });

      if (headerRows.length == 0)
         return null;

      return headerRows;
   }

   onHeaderClick(e, column, instance, headerLine) {
      e.preventDefault();
      e.stopPropagation();

      let {data} = instance;
      let header = column.components[`header${headerLine + 1}`];

      if (header && header.allowSorting && column.sortable && (column.field || column.sortField || column.value)) {
         let sortField = column.sortField || column.field;
         let dir = 'ASC';
         if (data.sorters && data.sorters[0].field == sortField && (data.sorters[0].value == column.value || data.sortField)) {
            if (data.sorters[0].direction == 'ASC')
               dir = 'DESC';
            else if (this.clearableSort && data.sorters[0].direction == 'DESC')
               dir = null;
         }

         let sorters = dir ? [{
            field: sortField,
            direction: dir,
            value: column.value
         }] : null;

         instance.set('sorters', sorters);
         instance.set('sortField', sortField);
         instance.set('sortDirection', dir);

         if (!this.remoteSort || this.infinite)
            instance.setState({sorters});
      }
   }

   renderGroupHeader(context, instance, g, level, group, i, store) {
      let {CSS, baseClass} = this;
      let data = store.getData();
      let caption = g.caption(data);
      return <tbody key={`g-${level}-${i}`} className={CSS.element(baseClass, 'group-caption', ['level-' + level])}>
      <tr>
         <td colSpan={1000}>{caption}</td>
      </tr>
      </tbody>;
   }

   renderGroupFooter(context, instance, g, level, group, i, store, fixed) {
      let {CSS, baseClass} = this;
      let data = store.getData();
      let skip = 0;

      let {header} = instance.components;

      let lines = [];
      header.children.forEach((line, lineIndex) => {

         let empty = true;

         let cells = line.children.map((ci, i) => {
            if (--skip >= 0)
               return null;

            let v, c = ci.widget, colSpan, pad;
            if (c.footer) {
               v = c.footer.value(data);
               pad = c.footer.pad;
               colSpan = c.footer.colSpan;
               empty = false;

               if (c.footer.expand) {
                  colSpan = 1;
                  for (let ind = i + 1; ind < line.children.length && !line.children[ind].widget.footer && !line.children[ind].widget.aggregate; ind++)
                     colSpan++;
               }

               if (colSpan > 1)
                  skip = colSpan - 1;
            }
            else if (c.aggregate && c.aggregateField && c.footer !== false) {
               empty = false;
               v = group[c.aggregateField];
               if (isString(ci.data.format))
                  v = Format.value(v, ci.data.format);
            }

            let cls = '';
            if (c.align)
               cls += CSS.state('aligned-' + c.align);

            if (pad !== false)
               cls += (cls ? ' ' : '') + CSS.state('pad');

            return <td
               key={i}
               className={cls}
               colSpan={colSpan}
            >
               {v}
            </td>;
         });

         if (empty)
            return;

         if (fixed)
            cells.push(<td key="dummy" className={CSS.element(baseClass, 'fixed-footer-corner')}/>);

         lines.push(
            <tr key={lineIndex}>
               {cells}
            </tr>
         );
      });

      if (lines.length == 0)
         return null;

      return (
         <tbody
            key={'f' + i}
            className={CSS.element(baseClass, 'group-footer', ['level-' + level])}
         >
         {lines}
         </tbody>
      );
   }

   renderRows(context, instance) {

      let {records} = instance;

      instance.footerVDOM = null;

      if (!isArray(records))
         return null;

      let record, g;

      for (let i = 0; i < records.length; i++) {
         record = records[i];
         if (record.type == 'data')
            record.vdom = record.row.render(context, record.key);

         if (record.type == 'group-header') {
            record.vdom = [];
            g = record.grouping;
            if (g.caption)
               record.vdom.push(this.renderGroupHeader(context, instance, g, record.level, record.group, record.key + '-caption', record.store));

            if (g.showHeader)
               record.vdom.push(this.renderHeader(context, instance, record.key + '-header'));
         }

         if (record.type == 'group-footer') {
            g = record.grouping;
            if (g.showFooter) {
               record.vdom = this.renderGroupFooter(context, instance, g, record.level, record.group, record.key + '-footer', record.store);
            }
         }

         if (this.fixedFooter && i == records.length - 1) {
            instance.footerVDOM = this.renderGroupFooter(context, instance, g, record.level, record.group, record.key + '-footer', record.store, true);
         }
      }
   }

   mapRecords(context, instance) {
      let {data, store} = instance;

      let filter = null;
      if (this.onCreateFilter)
         filter = instance.invoke("onCreateFilter", data.filterParams, instance);

      let sorters = !this.remoteSort && data.sorters;

      this.dataAdapter.setFilter(filter);
      this.dataAdapter.sort(sorters);

      //if no filtering or sorting applied, let the component maps records on demand
      if (this.buffered && !filter && !isNonEmptyArray(sorters))
         return null;

      return this.dataAdapter.getRecords(context, instance, data.records, store);
   }

   mapRecord(context, instance, data, index) {
      return this.dataAdapter.mapRecord(context, instance, data, instance.store, this.recordsBinding, index);
   }
}

Grid.prototype.baseClass = 'grid';
Grid.prototype.showHeader = true;
Grid.prototype.showFooter = false;
Grid.prototype.recordName = '$record';
Grid.prototype.indexName = '$index';
Grid.prototype.remoteSort = false;
Grid.prototype.lockColumnWidths = false;
Grid.prototype.lockColumnWidthsRequiredRowCount = 3;
Grid.prototype.focused = false;
Grid.prototype.emptyText = false;
Grid.prototype.showBorder = false; // show border override for material theme
Grid.prototype.cached = false;
Grid.prototype.buffered = false;
Grid.prototype.bufferStep = 15;
Grid.prototype.bufferSize = 60;
Grid.prototype.pageSize = 100;
Grid.prototype.infinite = false;
Grid.prototype.styled = true;
Grid.prototype.scrollSelectionIntoView = false;
Grid.prototype.clearableSort = false;
Grid.prototype.cellEditable = false;

Widget.alias('grid', Grid);
Localization.registerPrototype('cx/widgets/Grid', Grid);

class GridComponent extends VDOM.Component {
   constructor(props) {
      super(props);
      this.dom = {};
      let {widget} = props.instance;

      let end = Math.min(widget.bufferSize, props.data.totalRecordCount);

      this.state = {
         cursor: widget.focused && widget.selectable ? 0 : -1,
         cursorCellIndex: 0,
         focused: widget.focused,
         dragInsertionIndex: null,
         start: 0,
         end: end
      };

      this.syncBuffering = false;

      if (widget.infinite) {
         this.start = 0;
         this.end = end;
         this.syncBuffering = false; //control with a flag
         this.loadingStartPage = 0;
         this.loadingEndPage = 0;
      }

      this.scrollerRef = el => {
         this.dom.scroller = el;
      }
   }

   render() {
      let {instance, data} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;
      let {dragSource} = data;
      let {dragged, start, end, cursor, cursorCellIndex, cellEdit} = this.state;

      if (this.syncBuffering) {
         start = this.start;
         end = this.end;
      }

      let children = [];

      let addRow = (record, i, standalone) => {
         let {store, key, row} = record;
         let isDragged = dragged && (row.selected || record == dragged);
         let mod = {
            selected: row.selected,
            dragged: isDragged,
            draggable: dragSource && row.dragHandles.length == 0,
            cursor: widget.selectable && i == cursor
         };

         let wrap = (children) => <GridRowComponent
            key={key}
            className={CSS.state(mod)}
            store={store}
            dragSource={dragSource}
            instance={row}
            grid={instance}
            record={record}
            parent={this}
            cursorIndex={i}
            selected={row.selected}
            isBeingDragged={dragged}
            cursor={mod.cursor}
            cursorCellIndex={i == cursor && cursorCellIndex}
            cellEdit={i == cursor && cursorCellIndex && cellEdit}
            shouldUpdate={row.shouldUpdate}
         >
            {children.content.map(({key, data, content}) => <tr key={key} className={data.classNames}
                                                                style={data.style}>
               {content.map(({key, data, content, instance}, cellIndex) => {
                     let cellected = i == cursor && cellIndex == cursorCellIndex;
                     let className = cellected ? CSS.expand(data.classNames, CSS.state("cellected")) : data.classNames;
                     if (cellected && cellEdit) {
                        let column = widget.row.line1.columns[cursorCellIndex];
                        if (column && column.editor && data.editable)
                        //add an inner div with fixed height in order to help IE absolutely position the contents inside
                           return <td key={key} className={CSS.element(baseClass, "cell-editor")}>
                              <div
                                 className={CSS.element(baseClass, "cell-editor-wrap")}
                                 style={this.rowHeight > 0 ? {height: this.rowHeight + 1} : null}
                              >
                                 <Cx parentInstance={instance} subscribe>
                                    <ValidationGroup
                                       valid={{
                                          get: () => this.cellEditorValid,
                                          set: (value) => {
                                             this.cellEditorValid = value;
                                          }
                                       }}
                                    >
                                       {column.editor}
                                    </ValidationGroup>
                                 </Cx>
                              </div>
                           </td>
                     }
                     return <td
                        key={key}
                        className={className}
                        style={data.style}
                        colSpan={data.colSpan}
                        rowSpan={data.rowSpan}
                     >
                        {content}
                     </td>
                  }
               )}
            </tr>)}
         </GridRowComponent>;

         if (standalone) {
            children.push(<Cx
               key={key}
               instance={record.row}
               parentInstance={instance}
               options={{name: 'grid-row'}}
               contentFactory={x => wrap({
                  content: Array.isArray(x.children) ? x.children : [x.children],
                  data: {}
               })}
               params={{
                  ...mod,
                  cursor: i == cursor,
                  data: record.data,
                  cursorCellIndex: i == cursor && cursorCellIndex,
                  cellEdit: i == cursor && cursorCellIndex && cellEdit
               }}
            />);
         }
         else
            children.push(wrap(record.vdom));

         //avoid re-rendering on cursor change
         row.shouldUpdate = false;
      };
      if (widget.buffered) {
         let context = new RenderingContext();
         let dummyDataClass = CSS.element(baseClass, "data", {"dummy": true});
         if (!instance.recordInstanceCache)
            instance.recordInstanceCache = new InstanceCache(instance);
         instance.recordInstanceCache.mark();
         this.getRecordsSlice(start, end).forEach((r, i) => {
            if (r == null) {
               addRow({
                  key: 'dummy-' + start + i,
                  row: {
                     data: {classNames: dummyDataClass},
                     widget: widget.row
                  },
                  vdom: {
                     content: [{
                        key: 0,
                        data: {},
                        content: [{
                           key: 0,
                           data: {
                              colSpan: 1000,
                              style: {
                                 height: `${this.rowHeight}px`
                              }
                           }
                        }]
                     }]
                  }
               }, start + i)
            } else {
               let record = instance.records ? r : widget.mapRecord(context, instance, r, widget.infinite ? start + i - data.offset : start + i);
               let row = record.row = instance.recordInstanceCache.getChild(widget.row, record.store, record.key);
               row.detached = true;
               row.selected = instance.isSelected(record.data, record.index);
               // if (row.cache('selected', row.selected) || row.cache('recordData', record.data)) {
               //    //row.markShouldUpdate(context);
               // }
               addRow(record, start + i, true);
            }
         });
         instance.recordInstanceCache.sweep();
      }
      else {
         instance.records.forEach((record, i) => {
            if (record.type == 'data') {
               addRow(record, i);
            }
            else
               children.push(record.vdom);
         });
      }

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

      if (data.totalRecordCount == 0 && data.emptyText) {
         children = [
            <tbody
               key="empty"
               className={CSS.element(baseClass, 'empty-text')}
            >
            <tr>
               <td colSpan={1000}>
                  {data.emptyText}
               </td>
            </tr>
            </tbody>
         ];
      }

      content.push(
         <div
            key="scroller"
            ref={this.scrollerRef}
            tabIndex={widget.selectable || widget.cellEditable ? 0 : null}
            onScroll={::this.onScroll}
            className={CSS.element(baseClass, 'scroll-area', {"fixed-header": !!this.props.header})}
            onKeyDown={::this.handleKeyDown}
            onFocus={::this.onFocus}
            onBlur={::this.onBlur}
         >
            <div
               className={CSS.element(baseClass, 'table-wrapper')}
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
         </div>
      );

      if (this.props.fixedHeader)
         content.push(<div
            key="fh"
            ref={el => {
               this.dom.fixedHeader = el
            }}
            className={CSS.element(baseClass, 'fixed-header')}
            style={{
               display: this.scrollWidth > 0 ? 'block' : 'none'
            }}
         >
            <table>
               {this.props.fixedHeader}
            </table>
         </div>);

      if (this.props.fixedFooter)
         content.push(<div
            key="ff"
            ref={el => {
               this.dom.fixedFooter = el
            }}
            className={CSS.element(baseClass, 'fixed-footer')}
            style={{
               display: this.scrollWidth > 0 ? 'block' : 'none'
            }}
         >
            <table>
               {this.props.fixedFooter}
            </table>
         </div>);

      return <div
         className={data.classNames}
         style={data.style}
      >
         {content}
      </div>
   }

   getRecordsSlice(start, end) {
      let {data, instance} = this.props;
      let {widget} = instance;
      if (!widget.infinite) {
         let source = instance.records || data.records;
         return source.slice(start, end);
      }

      let {offset, records} = data;
      let result = [];
      for (let i = start; i < Math.min(end, data.totalRecordCount); i++) {
         if (i >= offset && i < offset + records.length)
            result.push(records[i - offset]);
         else
            result.push(null);
      }

      return result;
   }

   ensureData(visibleStart, visibleEnd) {
      if (this.loading)
         return;

      let {instance} = this.props;
      let {widget} = instance;
      let {pageSize} = widget;

      let startPage = Math.trunc(visibleStart / pageSize) + 1,
         endPage = Math.trunc((visibleEnd - 1) / pageSize) + 1;

      //debouncing restricts excessive page loading on fast scrolling as rendering data is
      //useless because visible region is scrolled away before data appears
      //the user should spent some time on the page before loading it

      if (!this.loadPageRange)
         this.loadPageRange = debounce((startPage, endPage) => {
            let {data} = this.props;
            let {records, offset} = data;
            let promises = [];

            for (let page = startPage; page <= endPage; page++) {
               let s = (page - 1) * pageSize, e = s + pageSize;
               if (s >= offset && e <= offset + records.length) {
                  promises.push(Promise.resolve(records.slice(s - offset, e - offset)));
               } else {
                  let result = instance.invoke("onFetchRecords", {
                     page,
                     pageSize,
                     sorters: data.sorters,
                     sortField: data.sortField,
                     sortDirection: data.sortDirection,
                     filterParams: data.filterParams
                  }, instance);
                  promises.push(Promise.resolve(result));
               }
            }

            this.loading = true;

            Promise
               .all(promises)
               .then(pageRecords => {
                  this.loading = false;
                  let records = [];
                  let totalRecordCount;
                  let lastPage;

                  pageRecords.forEach(page => {
                     if (Array.isArray(page)) {
                        records.push(...page);
                     } else {
                        if (!Array.isArray(page.records))
                           throw new Error('onFetchRecords should return an array of records or an object with results inside records property.');
                        totalRecordCount = page.totalRecordCount;
                        lastPage = page.lastPage;
                        records.push(...page.records);
                     }
                  });

                  let {data} = this.props;

                  if (!isNumber(totalRecordCount)) {
                     totalRecordCount = (startPage - 1) * pageSize + records.length;
                     if (!lastPage && records.length == (endPage - startPage + 1) * pageSize)
                        totalRecordCount++;
                     if (data.totalRecordCount > totalRecordCount)
                        totalRecordCount = data.totalRecordCount;
                  }

                  instance.buffer.totalRecordCount = data.totalRecordCount = totalRecordCount;
                  instance.buffer.records = data.records = records;
                  instance.buffer.page = data.page = startPage;
                  data.offset = (startPage - 1) * pageSize;

                  instance.store.silently(() => {
                     instance.set('records', records);
                     instance.set('page', startPage);
                     instance.set('totalRecordCount', totalRecordCount);
                  });

                  let stateChanges = {
                     startPage, endPage
                  };

                  if (this.state.end == 0)
                     stateChanges.end = Math.min(widget.bufferSize, totalRecordCount);

                  this.setState(stateChanges, () => {
                     this.loadingStartPage = startPage;
                     this.loadingEndPage = endPage;
                     this.onScroll();
                  });
               })
               .catch(error => {
                  this.loading = false;
                  if (widget.onLoadingError)
                     instance.invoke(error, "onLoadingError", instance);
               })
         }, 30);

      if (startPage < this.loadingStartPage || endPage > this.loadingEndPage) {
         this.loadingStartPage = startPage;
         this.loadingEndPage = endPage;
         this.loadPageRange(startPage, endPage);
      }
   }

   onScroll() {
      if (this.dom.fixedHeader) {
         this.dom.fixedHeader.scrollLeft = this.dom.scroller.scrollLeft;
      }

      if (this.dom.fixedFooter) {
         this.dom.fixedFooter.scrollLeft = this.dom.scroller.scrollLeft;
      }

      let {instance, data} = this.props;
      let {widget} = instance;
      if (widget.buffered && !this.pending) {
         let start = 0;
         if (this.rowHeight > 0) {
            start = Math.round(this.dom.scroller.scrollTop / this.rowHeight - widget.bufferStep);
            start = Math.round(start / widget.bufferStep) * widget.bufferStep;
            start = Math.max(0, Math.min(start, data.totalRecordCount - widget.bufferSize));
         }
         let end = Math.min(data.totalRecordCount, start + widget.bufferSize);

         if (widget.infinite) {
            this.ensureData(start, end);
         }

         if (this.syncBuffering) {
            this.start = start;
            this.end = end;
         }
         else if (this.state.end != end) {
            this.pending = true;
            this.setState({start, end}, () => {
               this.pending = false;
            });
         }
      }
   }

   shouldComponentUpdate(props, state) {
      return props.shouldUpdate !== false || state !== this.state;
   }

   componentDidMount() {
      this.componentDidUpdate();
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.scrollable)
         this.offResize = ResizeManager.trackElement(this.dom.scroller, ::this.componentDidUpdate);
      if (widget.pipeKeyDown)
         instance.invoke("pipeKeyDown", ::this.handleKeyDown, instance);
      this.unregisterDropZone = registerDropZone(this);
      if (widget.infinite)
         this.ensureData(0, 0);
   }

   onDragStart(e) {
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.onDragStart)
         instance.invoke("onDragStart", e, instance);
   }

   onDrop(e) {
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.onDrop) {
         e.target = {
            insertionIndex: this.state.dragInsertionIndex
         };
         instance.invoke("onDrop", e, instance);
      }
   }

   onDropTest(e) {
      let {instance} = this.props;
      let {widget} = instance;
      return widget.onDropTest && instance.invoke("onDropTest", e, instance);
   }

   onDragEnd(e) {
      this.setState({
         dragInsertionIndex: null,
         lastDragInsertionIndex: null
      });
      let {instance} = this.props;
      let {widget} = instance;
      if (widget.onDragEnd)
         instance.invoke("onDragEnd", e, instance);
   }

   onDragMeasure(e) {
      let r = getTopLevelBoundingClientRect(this.dom.scroller);
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
      let nodes = Array
         .from(this.dom.table.children)
         .filter(node => node.className && node.className.indexOf(rowClass) != -1);


      let s = 0, e = nodes.length, m, b;
      let parentOffset = getParentFrameBoundingClientRect(this.dom.scroller);
      let cy = ev.cursor.clientY - parentOffset.top;

      while (s < e) {
         m = Math.floor((s + e) / 2);
         b = nodes[m].getBoundingClientRect();

         //dragged items might be invisible and have no client bounds
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
      let {data, widget} = props.instance;
      this.setState({
         cursor: Math.max(Math.min(this.state.cursor, data.totalRecordCount - 1), widget.selectable && this.state.focused ? 0 : -1)
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
         instance.invoke("pipeKeyDown", null, instance);
   }

   componentDidUpdate() {
      let {instance, data} = this.props;
      let {widget} = instance;

      if (widget.lockColumnWidths && isArray(data.records) && data.records.length >= widget.lockColumnWidthsRequiredRowCount) {
         let headerTBody = this.dom.table.firstChild;
         for (let r = 0; r < headerTBody.children.length; r++) {
            let sr = headerTBody.children[r];
            for (let c = 0; c < sr.children.length; c++) {
               let cell = sr.children[c];
               cell.style.width = cell.style.minWidth = cell.style.maxWidth = `${sr.children[c].offsetWidth}px`;
               cell.style.boxSizing = 'border-box';
            }
         }
      }

      if (widget.scrollable) {
         this.scrollWidth = this.dom.scroller.offsetWidth - this.dom.scroller.clientWidth;

         let resized = false, headerHeight = 0, footerHeight = 0, rowHeight = 0;

         if (this.dom.fixedHeader) {

            let fixedHeaderTBody = this.dom.fixedHeader.firstChild.firstChild;

            resized = copyCellWidths(this.dom.table.firstChild, fixedHeaderTBody);

            let scrollColumnEl = fixedHeaderTBody.firstChild.lastChild;
            if (scrollColumnEl)
               scrollColumnEl.style.minWidth = scrollColumnEl.style.maxWidth = this.scrollWidth + 'px';

            this.dom.fixedHeader.style.display = 'block';
            headerHeight = this.dom.fixedHeader.offsetHeight;
            this.dom.scroller.style.marginTop = `${headerHeight}px`;
         }
         else {
            this.dom.scroller.style.marginTop = 0;
         }

         if (this.dom.fixedFooter) {
            let dstTableBody = this.dom.fixedFooter.firstChild.firstChild;
            let srcTableBody = this.dom.table.lastChild;

            copyCellWidths(srcTableBody, dstTableBody);

            let scrollColumnEl = dstTableBody.firstChild.lastChild;
            if (scrollColumnEl)
               scrollColumnEl.style.minWidth = scrollColumnEl.style.maxWidth = this.scrollWidth + 'px';

            this.dom.fixedFooter.style.display = 'block';
            footerHeight = this.dom.fixedFooter.offsetHeight;
            this.dom.scroller.style.marginBottom = `${footerHeight}px`;

            //Show the last row if fixed footer is shown without grouping, otherwise hide it
            //Hacky: accessing internal adapter property to check if grouping is applied
            if (!isNonEmptyArray(widget.dataAdapter.groupings))
               footerHeight = 0;
         }
         else {
            this.dom.scroller.style.marginBottom = 0;
         }

         if (widget.buffered) {
            let {start, end} = this.state;
            if (this.syncBuffering) {
               start = this.start;
               end = this.end;
            }
            let remaining = 0,
               count = Math.min(data.totalRecordCount, end - start);
            if (count > 0) {
               rowHeight = Math.round((this.dom.table.offsetHeight - headerHeight) / count);
               // if (this.rowHeight && this.rowHeight != rowHeight) {
               //    console.warn("ROW-HEIGHT-CHANGE", this.rowHeight, rowHeight);
               // }
               remaining = Math.max(0, data.totalRecordCount - end);
            }
            this.dom.table.style.marginTop = `${ (-headerHeight + start * rowHeight).toFixed(0) }px`;
            this.dom.table.style.marginBottom = `${ (remaining * headerHeight - footerHeight).toFixed(0) }px`;
         } else {
            this.dom.table.style.marginTop = `${-headerHeight}px`;
            this.dom.table.style.marginBottom = `${-footerHeight}px`;
         }

         this.rowHeight = rowHeight;

         let sortersChanged = widget.infinite && !shallowEquals(data.sorters, this.lastSorters);

         if (data.totalRecordCount == 0) {
            this.dom.scroller.scrollTop = 0;
         }

         if (sortersChanged || data.filterParams !== this.lastScrollFilterParams) {
            this.dom.scroller.scrollTop = 0;
            this.lastScrollFilterParams = data.filterParams;
            this.lastSorters = data.sorters;
            if (widget.infinite) {
               this.loadingStartPage = 0;
               this.loadingEndPage = 0;
               instance.buffer.records = data.records = [];
               instance.buffer.totalRecordCount = 0;
               instance.buffer.page = 1;
            }
         }

         if (widget.scrollSelectionIntoView && !widget.buffered) {
            let {CSS, baseClass} = widget;
            let selectedRowSelector = `.${CSS.element(baseClass, "data")}.${CSS.state("selected")}`;
            let firstSelectedRow = this.dom.table.querySelector(selectedRowSelector);
            if (firstSelectedRow != this.selectedEl) {
               firstSelectedRow && scrollElementIntoView(firstSelectedRow);
               this.selectedEl = firstSelectedRow;
            }
         }

         setTimeout(::this.onScroll, 0);

         if (resized)
            instance.fixedHeaderResizeEvent.notify();
      }
   }

   moveCursor(index, {focused, hover, scrollIntoView, select, selectRange, selectOptions, cellIndex, cellEdit, cancelEdit} = {}) {
      let {widget} = this.props.instance;
      if (!widget.selectable && !widget.cellEditable)
         return;

      let newState = {};

      if (cellEdit != null && cellEdit != this.state.cellEdit) {
         newState.cellEdit = cellEdit;
         if (cellEdit && !widget.row.line1.columns[this.state.cursorCellIndex].editor)
            newState.cellEdit = false;
      }

      if (cellIndex != null && cellIndex != this.state.cursorCellIndex) {
         newState.cursorCellIndex = cellIndex;
         newState.cellEdit = false;
      }

      if (widget.focused)
         focused = true;

      if (focused != null && this.state.focused != focused) {
         newState.focused = focused;
         newState.cellEdit = false;
      }

      if (index != this.state.cursor) {
         newState.cursor = index;
         newState.cellEdit = false;
      }

      if (select) {
         let start = selectRange && this.state.selectionStart >= 0 ? this.state.selectionStart : index;
         if (start < 0)
            start = index;
         this.selectRange(start, index, selectOptions);
         if (!selectRange)
            newState.selectionStart = index;
      }

      if (Object.keys(newState).length > 0) {
         let prevState = this.state;
         this.setState(newState, () => {
            let wasCellEditing = prevState.focused && prevState.cellEdit;
            if (!this.state.cellEdit && wasCellEditing) {
               FocusManager.focus(this.dom.scroller);
               let record = this.getRecordAt(prevState.cursor);
               if ((!this.cellEditorValid || cancelEdit) && this.cellEditUndoData)
                  record.store.set(widget.recordName, this.cellEditUndoData);
               else {
                  if (widget.onCellEdited && record.data != this.cellEditUndoData)
                     this.props.instance.invoke("onCellEdited", {
                        column: widget.row.line1.columns[prevState.cursorCellIndex],
                        newData: record.data,
                        oldData: this.cellEditUndoData,
                        field: widget.row.line1.columns[prevState.cursorCellIndex].field
                     }, record);
               }
            }

            if (this.state.cellEdit && !wasCellEditing)
               this.cellEditUndoData = this.getRecordAt(this.state.cursor).data;

            if (scrollIntoView) {
               let start = !widget.buffered ? 0 : this.syncBuffering ? this.start : this.state.start;
               let item = this.dom.table.children[index + 1 - start];
               if (widget.cellEditable && this.state.cursorCellIndex >= 0 && item)
                  item = item.firstChild.children[this.state.cursorCellIndex];
               if (item)
                  scrollElementIntoView(item, true, widget.cellEditable);
            }
         });
      }
   }

   showCursor(focused) {
      let {records, isSelected} = this.props.instance;
      let cursor = this.state.cursor;
      if (cursor == -1) {
         if (records) {
            cursor = records.findIndex(x => isSelected(x.data, x.index));
            //if there are no selected records, find the first data record (skip group header)
            if (cursor == -1)
               cursor = records.findIndex(x => x.type == 'data');
         }
         else
            cursor = 0;
      }
      this.moveCursor(cursor, {focused: true, scrollIntoView: true});
   }

   onFocus() {
      FocusManager.nudge();

      //focus moved within the grid
      if (this.state.focused)
         return;

      let {widget} = this.props.instance;

      //the cursor will be set if focus in originating from a mouse event
      setTimeout(() => {
         this.showCursor(true);
      }, 0);

      if (!widget.focused) {
         if (this.dom.scroller) {
            //if an inner element is focused first (autoFocus), this.dom.scroller might be undefined
            oneFocusOut(this, this.dom.scroller, () => {
               this.moveCursor(-1, {focused: false});
            });
         }
      }

      this.setState({
         focused: true
      });
   }

   onBlur() {
      FocusManager.nudge();
   }

   selectRange(from, to, options) {
      let {instance, data} = this.props;
      let {records, widget} = instance;

      if (from > to) {
         let tmp = from;
         from = to;
         to = tmp;
      }

      let selection = [], indexes = [];

      for (let cursor = from; cursor <= to; cursor++) {
         let record;
         if (records)
            record = records[cursor];
         else {
            let offset = widget.infinite ? data.offset : 0;
            let r = data.records[cursor - offset];
            if (r)
               record = widget.mapRecord(null, instance, r, cursor - offset);
         }
         if (record) {
            selection.push(record.data);
            indexes.push(record.index);
         }
      }

      widget.selection.selectMultiple(instance.store, selection, indexes, options);
   }

   getRecordAt(cursor) {
      let {instance, data} = this.props;
      let {records, widget} = instance;

      if (records)
         return records[cursor];

      let offset = widget.infinite ? data.offset : 0;
      let r = data.records[cursor - offset];
      if (r)
         return widget.mapRecord(null, instance, r, cursor - offset);

      return null;
   }

   handleKeyDown(e) {

      let {instance, data} = this.props;
      let {widget} = instance;

      if (widget.onKeyDown && instance.invoke("onKeyDown", e, instance) === false)
         return;

      switch (e.keyCode) {
         case KeyCode.enter:
            this.moveCursor(this.state.cursor, {
               select: true,
               selectOptions: {
                  toggle: e.ctrlKey
               },
               selectRange: e.shiftKey,
               cellEdit: widget.cellEditable && !this.state.cellEdit,
               focused: true
            });
            e.stopPropagation();
            e.preventDefault();
            break;

         case KeyCode.esc:
            if (this.state.cellEdit) {
               this.moveCursor(this.state.cursor, {cellEdit: false, focused: true, cancelEdit: true});
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.down:
            if (this.state.cursor + 1 < data.totalRecordCount) {
               this.moveCursor(this.state.cursor + 1, {
                  focused: true,
                  scrollIntoView: true,
                  select: e.shiftKey,
                  selectRange: true
               });
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.up:
            if (this.state.cursor > 0) {
               this.moveCursor(this.state.cursor - 1, {
                  focused: true,
                  scrollIntoView: true,
                  select: e.shiftKey,
                  selectRange: true
               });
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.right:
            if (this.state.cursorCellIndex + 1 < widget.row.line1.columns.length) {
               this.moveCursor(this.state.cursor, {
                  focused: true,
                  cellIndex: this.state.cursorCellIndex + 1,
                  scrollIntoView: true,
               });
               e.stopPropagation();
               e.preventDefault();
            }
            break;

         case KeyCode.left:
            if (this.state.cursorCellIndex > 0) {
               this.moveCursor(this.state.cursor, {
                  focused: true,
                  cellIndex: this.state.cursorCellIndex - 1,
                  scrollIntoView: true,
               });
               e.stopPropagation();
               e.preventDefault();
            }
            break;
      }
   }

   beginDragDrop(e, record) {
      let {instance, data} = this.props;
      let {widget, store, isSelected} = instance;
      let {CSS, baseClass} = widget;

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

class GridColumnHeaderLine extends PureContainer {

   declareData() {
      return super.declareData(...arguments, {
         showHeader: undefined
      })
   }

   init() {
      this.items = Widget.create(GridColumnHeader, this.columns || []);
      this.visible = this.showHeader;
      this.style = this.headerStyle;
      this.className = this.headerClass;
      this.class = null;
      super.init();
   }

   render(context, instance, key) {
      let {data} = instance;
      return <tr
         key={key}
         className={data.classNames}
         style={data.style}
      >
         {this.renderChildren(context, instance)}
      </tr>
   }
}

GridColumnHeaderLine.prototype.isPureContainer = false;
GridColumnHeaderLine.prototype.styled = true;
GridColumnHeaderLine.prototype.showHeader = true;
GridColumnHeaderLine.lazyInit = false;

class GridColumnHeader extends Widget {

   declareData() {
      return super.declareData(...arguments, {
         format: undefined
      })
   }

   init() {
      delete this.style;
      delete this.className;
      delete this.class;

      if (this.header)
         this.header1 = this.header;

      if (this.header1 && isSelector(this.header1))
         this.header1 = {
            text: this.header1 || ''
         };

      if (this.header2 && isSelector(this.header2))
         this.header2 = {
            text: this.header2 || ''
         };

      if (this.header3 && isSelector(this.header3))
         this.header3 = {
            text: this.header3 || ''
         };

      if (!this.aggregateField && this.field)
         this.aggregateField = this.field;

      if (!this.aggregateAlias)
         this.aggregateAlias = this.aggregateField;

      if (this.footer && isSelector(this.footer))
         this.footer = {
            value: this.footer,
            pad: this.pad,
            format: this.format
         };

      if (this.footer)
         this.footer.value = getSelector(this.footer.value);

      super.init();
   }

   initComponents() {
      return super.initComponents({
         header1: this.header1 && GridColumnHeaderCell.create(this.header1),
         header2: this.header2 && GridColumnHeaderCell.create(this.header2),
         header3: this.header3 && GridColumnHeaderCell.create(this.header3),
      })
   }

   render() {
      return null;
   }
}

GridColumnHeader.lazyInit = false;

class GridColumnHeaderCell extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         text: undefined,
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

GridColumnHeaderCell.prototype.colSpan = 1;
GridColumnHeaderCell.prototype.rowSpan = 1;
GridColumnHeaderCell.prototype.allowSorting = true;
GridColumnHeaderCell.prototype.styled = true;

function initGrouping(grouping) {
   grouping.forEach(g => {
      if (g.caption)
         g.caption = getSelector(g.caption);
   })
}

function copyCellWidths(srcTableBody, dstTableBody) {
   if (!srcTableBody || !dstTableBody)
      return false;

   let changed = false;
   for (let r = 0; r < srcTableBody.children.length; r++) {
      let sr = srcTableBody.children[r];
      let dr = dstTableBody.children[r];
      for (let c = 0; c < sr.children.length; c++) {
         let dc = dr.children[c];
         let ws = `${sr.children[c].offsetWidth}px`;
         if (!changed && dc.style.width != ws)
            changed = true;
         dc.style.width = dc.style.minWidth = dc.style.maxWidth = ws;
      }
   }
   return changed;
}


