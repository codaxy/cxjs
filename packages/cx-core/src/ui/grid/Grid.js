import {Widget, VDOM, getContent} from '../Widget';
import {PureContainer} from '../PureContainer';
import {Binding} from '../../data/Binding';
import {getSelector} from '../../data/getSelector';
import {isSelector} from '../../data/isSelector';
import {Format} from '../../util/Format';
import {Selection} from '../selection/Selection';
import {DataAdapter} from './DataAdapter';
import {GroupAdapter} from './GroupAdapter';
import {ResizeManager} from '../ResizeManager';

export class Grid extends Widget {

   declareData() {

      var selection = this.selection.configureWidget(this);

      super.declareData({
         records: undefined,
         class: { structured: true },
         className: { structured: true },
         style: { structured: true },
         sorters: undefined,
         scrollable: undefined,
         sortField: undefined,
         sortDirection: undefined
      }, selection, ...arguments);
   }

   init() {

      if (this.records && this.records.bind)
         this.recordsBinding = Binding.get(this.records.bind);

      this.columns = Widget.create(GridColumn, this.columns || [], {
         recordName: this.recordName
      });

      this.columns.forEach(c=> {
         c.init();
         if (c.footer)
            c.footer = getSelector(c.footer);
      });

      var aggregates = {};
      this.columns.filter(c=>c.aggregate && c.aggregateField).forEach(c=> {
         aggregates[c.aggregateField] = {
            value: { bind: this.recordName + '.' + c.field },
            weight: c.weightField && { bind: this.recordName + '.' + c.weightField },
            type: c.aggregate
         }
      });

      //if some columns have aggregates and grouping is not defined, add default footer
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

      super.init();

      if (this.grouping) {
         this.groupBy(this.grouping)
      }
   }

   initState(context, instance) {
      instance.state = {};
   }

   prepareData(context, instance) {

      var {data, state} = instance;

      if (state.sorters && !data.sorters)
         data.sorters = state.sorters;

      if (data.sortField && data.sortDirection)
         data.sorters = [{
            field: data.sortField,
            direction: data.sortDirection
         }];

      data.stateMods = {
         selectable: !this.selection.isDummy,
         scrollable: data.scrollable,
         sortable: this.columns.some(x=>x.sortable)
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

      instance.columns = [];

      this.columns.forEach(c=> {
         var column = instance.getChild(context, c);
         if (column.explore(context))
            instance.columns.push(column);
      });

      var {store} = instance;
      instance.isSelected = this.selection.getIsSelectedDelegate(store);

      instance.records.forEach(record => {
         if (record.cells) {
            var wasSelected = record.selected;
            record.selected = instance.isSelected(record.data, record.index);
            record.shouldUpdate = wasSelected != record.selected;
            record.cells.forEach(c => { c.explore(context); });
         }
      });
   }

   prepare(context, instance) {
      instance.records.forEach(record => {
         if (record.cells)
            record.cells.forEach(c => {
               c.prepare(context);
               if (c.shouldUpdate)
                  record.shouldUpdate = true;
               if (record.shouldUpdate)
                  instance.shouldUpdate = true;
            });
      });
      instance.columns.forEach(c=>c.prepare(context));
      super.prepare(context, instance);
   }

   cleanup(context, instance) {
      instance.records.forEach(record => {
         if (record.cells)
            record.cells.forEach(c => c.cleanup(context));
      });
      instance.columns.forEach(c=>c.cleanup(context));
      super.cleanup(context, instance);
   }

   groupBy(grouping, {autoConfigure} = {}) {
      if (grouping) {
         if (!Array.isArray(grouping)) {
            if (typeof grouping == 'string' || typeof grouping == 'object')
               return this.groupBy([grouping]);
            throw new Error('DynamicGrouping should be an array or grouping objects');
         }

         grouping = grouping.map((g, i)=> {
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
         this.showHeader = !Array.isArray(grouping) || !grouping.some(g=>g.showHeader);

      this.dataAdapter.groupBy(grouping);
      this.update();
   }

   render(context, instance, key) {
      var {data, refs} = instance;


      var fixedHeader = data.scrollable && this.showHeader && this.renderHeader(context, instance, 'header', {
            fixed: true,
            refs: refs.fixed,
            originalRefs: refs.header
         });

      var rows = this.renderRows(context, instance);

      refs.header = {};
      var header = this.showHeader && this.renderHeader(context, instance, 'header', {refs: refs.header});

      return <GridComponent key={key}
                            instance={instance}
                            header={header}
                            headerRefs={refs.header}
                            fixedHeader={fixedHeader}
                            fixedHeaderRefs={refs.fixed}>
         {rows}</GridComponent>
   }

   renderHeader(context, instance, key, {fixed, refs, originalRefs}) {
      var {data, store, widget} = instance;
      if (!refs)
         refs = {};
      var {CSS, baseClass} = widget;
      return <tbody key={'h'+key} className={CSS.element(baseClass, 'header')}>
      <tr>{
         instance.columns.map((columnInstance, i) => {
            var c = columnInstance.widget;
            var mods = [];

            if (c.align)
               mods.push('aligned-' + c.align);

            if (c.sortable) {
               mods.push('sortable');

               if (data.sorters && data.sorters[0].field == (c.sortField || c.field)) {
                  mods.push('sorted-' + data.sorters[0].direction.toLowerCase());
               }
            }

            var header = columnInstance.header;

            var style = header.data.style;
            var cls = CSS.element(baseClass, 'col-header', mods);
            if (header.data.classNames)
               cls += ' ' + header.data.classNames;

            var content = header.render(context);

            if (fixed && originalRefs[i]) {
               style = {...style, width: originalRefs[i].offsetWidth + 'px'}
            };

            return <th key={i}
                       ref={c=>{refs[i] = c}}
                       className={cls}
                       style={style}
                       onClick={e=>this.onHeaderClick(e, c, store, instance)}>
               {getContent(content)}
            </th>;
         })
      }</tr>
      </tbody>;
   }

   onHeaderClick(e, column, store, instance) {
      e.preventDefault();
      e.stopPropagation();

      var {data} = instance;

      if (column.sortable && (column.field || column.sortField)) {
         var sortField = column.sortField || column.field;
         var dir = 'ASC';
         if (data.sorters && data.sorters[0].field == sortField && data.sorters[0].direction == 'ASC')
            dir = 'DESC';

         var sorters = [{field: sortField, direction: dir}];

         instance.set('sorters', sorters);
         instance.set('sortField', sortField);
         instance.set('sortDirection', dir);

         if (!this.remoteSort)
            instance.setState({sorters});
      }
   }

   renderGroupHeader(context, instance, g, level, group, i, store) {
      var {CSS, baseClass} = this;
      var data = store.getData();
      data.$group = group;
      var caption = g.caption(data);
      return <tbody key={`g-${level}-${i}`} className={CSS.element(baseClass, 'group-caption', ['level-' + level])}>
      <tr>
         <td colSpan={instance.columns.length}>{caption}</td>
      </tr>
      </tbody>;
   }

   renderGroupFooter(context, instance, g, level, group, i, store) {
      var {CSS, baseClass} = this;
      var data = store.getData();
      data.$group = group;
      return <tbody key={'f'+i} className={CSS.element(baseClass, 'group-footer', ['level-'+level])}>
      <tr>
         {
            instance.columns.map((ci, i) => {
               var v, c = ci.widget;
               if (c.footer)
                  v = c.footer(data);
               else if (c.aggregate && c.aggregateField)
                  v = group[c.aggregateField];
               var cls = '';
               if (c.align)
                  cls += CSS.state('aligned-' + c.align);
               return <td key={i} className={cls}>{v}</td>;
            })
         }
      </tr>
      </tbody>;
   }

   renderRows(context, instance) {

      var {records} = instance;

      if (!Array.isArray(records))
         return null;

      var result = [];

      records.forEach(record=> {
         if (record.type == 'data')
            result.push(this.renderRow(context, instance, record));

         if (record.type == 'group-header') {
            var g = record.grouping;
            if (g.caption)
               result.push(this.renderGroupHeader(context, instance, g, record.level, record.group, record.key + '-caption', record.store));

            if (g.showHeader)
               result.push(this.renderHeader(context, instance, record.key + '-header', {}));
         }

         if (record.type == 'group-footer') {
            var g = record.grouping;
            if (g.showFooter)
               result.push(this.renderGroupFooter(context, instance, g, record.level, record.group, record.key + '-footer', record.store));
         }
      });
      return result;
   }

   onRowClick(e, record, index, store) {
      //e.preventDefault();
      e.stopPropagation();
      this.selection.select(store, record, index, {
         toggle: e.ctrlKey
      });
   }

   renderRow(context, instance, record) {
      var {data, store, index, key, selected} = record;
      var {CSS, baseClass} = instance.widget;

      if (this.memoize && record.shouldUpdate === false && record.vdom)
         return record.vdom;

      var mod = {
         selected: selected
      };

      var cells = [];

      record.cells.forEach((ci, i) => {
         if (!ci.visible)
            return;
         var c = ci.widget;
         var row = ci.render(context, String(i));
         var v = getContent(row);
         var state = [];
         if (c.align)
            state.push('aligned-' + c.align);
         if (ci.data.pad)
            state.push('pad');
         if (v == null) {
            v = ci.data.value;
            if (ci.data.format)
               v = Format.value(v, ci.data.format);
         }
         var cls = CSS.expand(ci.data.classNames, CSS.state(state));
         cells.push(<td key={i} className={cls} style={ci.data.style}>{v}</td>);
      });

      return record.vdom = <GridRowComponent key={key}
                               className={CSS.element(baseClass, 'data', mod)}
                               onClick={e=>this.onRowClick(e, data, index, store)}
                               isSelected={selected}
                               shouldUpdate={record.shouldUpdate}>
         <tr>{cells}</tr>
      </GridRowComponent>;
   }

   mapRecords(context, instance) {
      var {data, store} = instance;
      this.dataAdapter.sort(!this.remoteSort && data.sorters);
      return this.dataAdapter.getRecords(context, instance, data.records, store).map(record => {
         if (record.type == 'data') {
            record.cells = this.columns.map(c => instance.getChild(context, c, record.key, record.store));
            record.cells.forEach(c=> {
               c.repeatable = true;
            });
         }
         return record;
      });
   }
}

Grid.prototype.baseClass = 'grid';
Grid.prototype.showHeader = true;
Grid.prototype.showFooter = false;
Grid.prototype.recordName = '$record';
Grid.prototype.remoteSort = false;
Grid.prototype.lockColumnWidths = false;
Grid.prototype.lockColumnWidthsRequiredRowCount = 3;

Widget.alias('grid', Grid);

class GridColumn extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         style: { structured: true },
         class: { structured: true },
         className: { structured: true },
         value: undefined,
         pad: undefined,
         format: undefined
      })
   }

   init() {
      if (isSelector(this.header))
         this.header = {
            text: this.header || ''
         };
      this.header = Widget.create(GridColumnHeader, this.header);

      if (!this.value && this.field)
         this.value = { bind: this.recordName + '.' + this.field };

      if (!this.aggregateField && this.field)
         this.aggregateField = this.field;

      super.init();
   }

   initInstance(context, instance) {
      instance.header = instance.getChild(context, this.header);
   }

   explore(context, instance) {
      if (instance.repeatable)
         super.explore(context, instance);
      else {
         instance.header.explore(context);
      }
   }

   prepare(context, instance) {
      if (instance.repeatable)
         super.prepare(context, instance);
      else {
         instance.header.prepare(context);
      }
   }

   cleanup(context, instance) {
      if (instance.repeatable)
         super.cleanup(context, instance);
      else {
         instance.header.cleanup(context);
      }
   }
}

GridColumn.prototype.pad = true;

Grid.Column = GridColumn;

class GridColumnHeader extends PureContainer {
   declareData() {
      return super.declareData(...arguments, {
         text: undefined,
         style: { structured: true },
         class: { structured: true },
         className: { structured: true }
      })
   }

   render(context, instance, key) {
      var {data} = instance;
      return data.text || super.render(context, instance, key);
   }
}

function initGrouping(grouping) {
   grouping.forEach(g=> {
      if (g.caption)
         g.caption = getSelector(g.caption);
   })
}

class GridComponent extends VDOM.Component {
   constructor(props) {
      super(props);
      this.dom = {};
   }

   render() {
      var {data, widget} = this.props.instance;
      var {CSS, baseClass} = widget;

      return <div className={data.classNames} style={data.style} tabIndex={data.stateMods.selectable ? 0 : null}>
         <div ref={el=>{this.dom.scroller = el}}
              onScroll={::this.onScroll}
              className={CSS.element(baseClass, 'scroll-area')}>
            <table>
               {this.props.header}
               {this.props.children}
            </table>
         </div>
         { this.props.fixedHeader && <div ref={el=>{this.dom.fixedHeader = el}}
                                          className={CSS.element(baseClass, 'fixed-header')}
                                          style={{
                  display: this.scrollWidth > 0 ? 'block' : 'none',
                  right: `${this.scrollWidth || 0}px`
                  }}>
            <table>
               {this.props.fixedHeader}
            </table>
         </div> }
      </div>
   }

   onScroll(e) {
      if (this.dom.fixedHeader) {
         this.dom.fixedHeader.scrollLeft = e.target.scrollLeft;
      }
   }

   shouldComponentUpdate(props) {
      return props.instance.shouldUpdate !== false;
   }

   componentDidMount() {
      this.componentDidUpdate();
      var {widget} = this.props.instance;
      if (widget.scrollable)
         this.offResize = ResizeManager.subscribe(::this.componentDidUpdate);
   }

   componentWillUnmount() {
      if (this.offResize)
         this.offResize();
   }

   componentDidUpdate() {
      this.scrollWidth = this.dom.scroller.offsetWidth - this.dom.scroller.clientWidth;
      var {headerRefs, fixedHeaderRefs, instance}= this.props;
      var {widget, data} = instance;

      if (widget.lockColumnWidths && headerRefs && Array.isArray(data.records) && data.records.length >= widget.lockColumnWidthsRequiredRowCount) {
         for (var k in headerRefs) {
            var c = headerRefs[k];
            c.style.width = c.offsetWidth + 'px';
         }
      }

      if (this.dom.fixedHeader) {
         for (var k in headerRefs) {
            var c = headerRefs[k];
            var fhe = fixedHeaderRefs[k];
            if (fhe) {
               fhe.style.width = fhe.style.minWidth = fhe.style.maxWidth = c.offsetWidth + 'px';
            }
         }
         this.dom.fixedHeader.style.display = 'block';
         this.dom.fixedHeader.style.right = this.scrollWidth + 'px';
      }
   }
}

class GridRowComponent extends VDOM.Component {
   render() {
      return <tbody className={this.props.className} onClick={this.props.onClick}>
         {this.props.children}
      </tbody>
   }

   shouldComponentUpdate(props) {
      return props.shouldUpdate !== false;
   }
}
