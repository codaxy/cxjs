/**@jsxImportSource react */
import { Instance } from "../ui/Instance";
import type { RenderingContext } from "../ui/RenderingContext";
import { getAccessor } from "../data/getAccessor";
import { GroupAdapter, GroupingConfig } from "../ui/adapter/GroupAdapter";
import { batchUpdates } from "../ui/batchUpdates";
import { Container } from "../ui/Container";
import { FocusManager, offFocusOut, oneFocusOut, preventFocusOnTouch } from "../ui/FocusManager";
import { Selection } from "../ui/selection/Selection";
import { VDOM, Widget, getContent } from "../ui/Widget";
import { addEventListenerWithOptions } from "../util/addEventListenerWithOptions";
import { isArray } from "../util/isArray";
import { isString } from "../util/isString";
import { KeyCode } from "../util/KeyCode";
import { scrollElementIntoView } from "../util/scrollElementIntoView";

/*
 - renders list of items
 - focusable (keyboard navigation)
 - selection
 - fake focus - list appears focused and receives keyboard inputs redirected from other control (dropdown scenario)
 */

export class List extends Widget {
   declare public recordAlias?: string;
   declare public recordName: string;
   declare public indexAlias?: string;
   declare public indexName: string;
   declare public adapter: GroupAdapter;
   declare public child: ListItem;
   declare public items?: Widget[];
   declare public children?: Widget[];
   declare public selection: Selection;
   declare public itemClass?: string;
   declare public itemClassName?: string;
   declare public itemStyle?: string;
   declare public itemDisabled?: boolean;
   public item?: Widget;
   declare public layout?: any;
   declare public keyField?: string;
   declare public records?: any[];
   declare public sortOptions?: any;
   declare public grouping?: GroupingConfig[];
   declare public focusable?: boolean;
   declare public focused?: boolean;
   declare public itemPad?: boolean;
   declare public cached?: boolean;
   declare public scrollSelectionIntoView?: boolean;
   declare public selectMode?: boolean;
   declare public selectOnTab?: boolean;
   public pipeKeyDown?: string | ((handler: ((e: React.KeyboardEvent) => void) | null, instance: Instance) => void);
   declare public autoFocus?: boolean;
   declare public baseClass: string;
   public filter?: (item: unknown, filterParams: Record<string, unknown>) => boolean;
   public onCreateFilter?: (filterParams: Record<string, unknown>, instance: Instance) => (record: unknown) => boolean;
   public onItemClick?: (e: React.MouseEvent, instance: Instance) => void;
   public onItemDoubleClick?: (e: React.MouseEvent, instance: Instance) => void;
   public onKeyDown?: (e: React.KeyboardEvent, instance: Instance) => void;
   public onScroll?: (event: Event, instance: Instance) => void;
   public onFocus?: (event: FocusEvent, instance: Instance) => void;
   public onBlur?: (event: FocusEvent, instance: Instance) => void;
   public onMouseLeave?: (event: React.MouseEvent, instance: Instance) => void;
   public onMouseEnter?: (event: React.MouseEvent, instance: Instance) => void;
   public onMouseMove?: (event: React.MouseEvent, instance: Instance) => void;
   public onMouseUp?: (event: React.MouseEvent, instance: Instance) => void;
   public onMouseDown?: (event: React.MouseEvent, instance: Instance) => void;
   public onMouseOver?: (event: React.MouseEvent, instance: Instance) => void;
   public onMouseOut?: (event: React.MouseEvent, instance: Instance) => void;

   init() {
      if (this.recordAlias) this.recordName = this.recordAlias;

      if (this.indexAlias) this.indexName = this.indexAlias;

      this.adapter = GroupAdapter.create(this.adapter || GroupAdapter, {
         recordName: this.recordName,
         indexName: this.indexName,
         recordsAccessor: getAccessor(this.records),
         keyField: this.keyField,
         sortOptions: this.sortOptions,
      });

      this.child = ListItem.create({
         layout: this.layout,
         items: this.items,
         children: this.children,
         styled: true,
         class: this.itemClass,
         className: this.itemClassName,
         style: this.itemStyle,
         disabled: this.itemDisabled,
         ...this.item,
      }) as ListItem;

      delete this.children;

      this.selection = Selection.create(this.selection, {
         records: this.records,
      });

      super.init();

      if (this.grouping) {
         this.groupBy(this.grouping);
      }
   }

   initInstance(context: RenderingContext, instance: Instance) {
      this.adapter.initInstance(context, instance);
   }

   declareData() {
      let selection = this.selection.configureWidget(this);

      super.declareData(
         selection,
         {
            records: undefined,
            sorters: undefined,
            sortField: undefined,
            sortDirection: undefined,
            filterParams: {
               structured: true,
            },
            itemStyle: {
               structured: true,
            },
            emptyText: undefined,
            tabIndex: undefined,
         },
         ...arguments,
      );
   }

   prepareData(context: RenderingContext, instance: Instance) {
      let { data } = instance;

      if (data.sortField)
         data.sorters = [
            {
               field: data.sortField,
               direction: data.sortDirection || "ASC",
            },
         ];
      this.adapter.sort(data.sorters);

      let filter = null;
      if (this.onCreateFilter) filter = instance.invoke("onCreateFilter", data.filterParams, instance);
      else if (this.filter) filter = (item: unknown) => this.filter!(item, data.filterParams);
      this.adapter.setFilter(filter);
      instance.mappedRecords = this.adapter.getRecords(context, instance, data.records, instance.store);

      data.stateMods = Object.assign(data.stateMods || {}, {
         selectable: !this.selection.isDummy || this.onItemClick,
         empty: instance.mappedRecords.length == 0,
      });

      super.prepareData(context, instance);
   }

   applyParentStore(instance: Instance) {
      super.applyParentStore(instance);

      // force prepareData to execute again and propagate the store change to the records
      if (instance.cached) delete instance.cached.rawData;
   }

   explore(context: RenderingContext, instance: Instance, data: Record<string, unknown>): void {
      let instances: Instance[] = [];
      let isSelected = this.selection.getIsSelectedDelegate(instance.store);
      instance.mappedRecords!.forEach((record) => {
         if (record.type == "data") {
            let itemInstance = instance.getChild(context, this.child, record.key, record.store);
            itemInstance.record = record;
            itemInstance.selected = isSelected(record.data, record.index);

            let changed = false;
            if (itemInstance.cache("recordData", record.data)) changed = true;
            if (itemInstance.cache("selected", itemInstance.selected)) changed = true;

            if (this.cached && !changed && itemInstance.visible && !itemInstance.childStateDirty) {
               instances.push(itemInstance);
               itemInstance.shouldUpdate = false;
            } else if (itemInstance.scheduleExploreIfVisible(context)) instances.push(itemInstance);
         } else if (record.type == "group-header" && record.grouping.header) {
            let itemInstance = instance.getChild(context, record.grouping.header, record.key, record.store);
            itemInstance.record = record;
            if (itemInstance.scheduleExploreIfVisible(context)) instances.push(itemInstance);
         } else if (record.type == "group-footer" && record.grouping.footer) {
            let itemInstance = instance.getChild(context, record.grouping.footer, record.key, record.store);
            itemInstance.record = record;
            if (itemInstance.scheduleExploreIfVisible(context)) instances.push(itemInstance);
         }
      });
      instance.instances = instances;
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      let items = instance.instances!.map((x) => ({
         instance: x,
         key: x.record.key,
         type: x.record.type,
         content: getContent(x.render(context)),
      }));
      return (
         <ListComponent
            key={key}
            instance={instance}
            items={items}
            selectable={(!this.selection.isDummy || !!this.onItemClick) as boolean}
         />
      );
   }

   groupBy(grouping: GroupingConfig[]): void {
      if (!isArray(grouping)) {
         if (isString(grouping) || typeof grouping == "object") return this.groupBy([grouping]);
         throw new Error("DynamicGrouping should be an array of grouping objects");
      }

      grouping = grouping.map((g, i) => {
         if (isString(g)) {
            return {
               key: {
                  [g]: {
                     bind: this.recordName + "." + g,
                  },
               },
            };
         }
         return g;
      });

      grouping.forEach((g) => {
         if (g.header) g.header = Widget.create(g.header);

         if (g.footer) g.footer = Widget.create(g.footer);
      });

      this.adapter.groupBy(grouping);
      this.update();
   }
}

List.prototype.recordName = "$record";
List.prototype.indexName = "$index";
List.prototype.baseClass = "list";
List.prototype.focusable = true;
List.prototype.focused = false;
List.prototype.itemPad = true;
List.prototype.cached = false;
List.prototype.styled = true;
List.prototype.scrollSelectionIntoView = false;
List.prototype.selectMode = false;
List.prototype.selectOnTab = false;

Widget.alias("list", List);

interface ListItemData {
   instance: Instance;
   key: string;
   type: string;
   content: React.ReactNode;
}

interface ListComponentProps {
   instance: Instance;
   items: ListItemData[];
   selectable: boolean | ((e: MouseEvent, instance: Instance) => void);
}

interface ListComponentState {
   cursor: number;
   focused: boolean;
   selectionStart?: number;
}

class ListComponent extends VDOM.Component<ListComponentProps, ListComponentState> {
   declare el?: HTMLUListElement;
   cursorChildIndex: number[] = [];
   declare selectedEl?: Element | null;
   unsubscribeScroll?: () => void;
   onKeyDown?: (e: React.KeyboardEvent, instance: Instance) => boolean | void;

   constructor(props: ListComponentProps) {
      super(props);
      let { widget } = props.instance;
      let { focused } = widget as unknown as { focused: boolean };
      this.state = {
         cursor: focused && props.selectable ? 0 : -1,
         focused: focused,
      };

      this.handleItemMouseDown = this.handleItemMouseDown.bind(this);
      this.handleItemDoubleClick = this.handleItemDoubleClick.bind(this);
      this.handleItemClick = this.handleItemClick.bind(this);
   }

   shouldComponentUpdate(props: ListComponentProps, state: ListComponentState): boolean {
      return props.instance.shouldUpdate || state != this.state;
   }

   componentDidMount(): void {
      let { instance } = this.props;
      let { widget } = instance as unknown as { widget: List };
      if (widget.pipeKeyDown) {
         instance.invoke("pipeKeyDown", this.handleKeyDown.bind(this), instance);
         this.showCursor();
      }

      if (widget.autoFocus && this.el) FocusManager.focus(this.el);

      if (widget.onScroll && this.el) {
         this.unsubscribeScroll = addEventListenerWithOptions(
            this.el,
            "scroll",
            (event) => {
               instance.invoke("onScroll", event, instance);
            },
            { passive: true },
         );
      }

      this.componentDidUpdate();
   }

   UNSAFE_componentWillReceiveProps(props: ListComponentProps): void {
      if (this.state.focused && (props.instance.widget as List).selectMode) this.showCursor(true, props.items);
      else if (this.state.cursor >= props.items.length) this.moveCursor(props.items.length - 1);
      else if (this.state.focused && this.state.cursor < 0) this.moveCursor(0);
   }

   componentWillUnmount(): void {
      let { instance } = this.props;
      let { widget } = instance as unknown as { widget: List };
      offFocusOut(this);
      if (widget.pipeKeyDown) instance.invoke("pipeKeyDown", null, instance);
   }

   handleItemMouseDown(e: React.MouseEvent<HTMLLIElement>): void {
      let index = Number((e.currentTarget as HTMLElement).dataset.recordIndex);
      this.moveCursor(index);
      if (e.shiftKey) e.preventDefault();

      this.moveCursor(index, {
         select: true,
         selectOptions: {
            toggle: e.ctrlKey && !e.shiftKey,
            add: e.ctrlKey && e.shiftKey,
         },
         selectRange: e.shiftKey,
      });
   }

   handleItemClick(e: React.MouseEvent<HTMLLIElement>): void {
      let { instance, items } = this.props;
      let index = Number((e.currentTarget as HTMLElement).dataset.recordIndex);
      let item = items[this.cursorChildIndex[index]];
      if (instance.invoke("onItemClick", e, item.instance) === false) return;

      this.moveCursor(index, {
         select: true,
         selectOptions: {
            toggle: e.ctrlKey && !e.shiftKey,
            add: e.ctrlKey && e.shiftKey,
         },
         selectRange: e.shiftKey,
      });
   }

   handleItemDoubleClick(e: React.MouseEvent<HTMLLIElement>): void {
      let { instance, items } = this.props;
      let index = Number((e.currentTarget as HTMLElement).dataset.recordIndex);
      let item = items[this.cursorChildIndex[index]];
      instance.invoke("onItemDoubleClick", e, item.instance);
   }

   render(): React.ReactNode {
      let { instance, items, selectable } = this.props;
      let { data, widget } = instance as unknown as { data: Record<string, any>; widget: List };
      let { CSS, baseClass } = widget;
      let itemStyle = CSS.parseStyle(data.itemStyle);
      this.cursorChildIndex = [];
      let cursorIndex = 0;

      let onDblClick: ((e: React.MouseEvent<HTMLLIElement>) => void) | undefined;
      let onClick: ((e: React.MouseEvent<HTMLLIElement>) => void) | undefined;

      if (widget.onItemClick) onClick = this.handleItemClick;

      if (widget.onItemDoubleClick) onDblClick = this.handleItemDoubleClick;

      let children: React.ReactNode =
         items.length > 0 &&
         items.map((x, i) => {
            let { data, selected } = x.instance as { data: any; selected?: boolean };
            let className;

            if (x.type == "data") {
               let ind = cursorIndex++;

               this.cursorChildIndex.push(i);
               className = CSS.element(baseClass, "item", {
                  selected: selected,
                  cursor: ind == this.state.cursor,
                  pad: widget.itemPad,
                  disabled: data.disabled,
               });

               return (
                  <li
                     key={x.key}
                     className={CSS.expand(className, data.classNames)}
                     style={itemStyle}
                     data-record-index={ind}
                     onMouseDown={this.handleItemMouseDown}
                     onClick={onClick}
                     onDoubleClick={onDblClick}
                  >
                     {x.content}
                  </li>
               );
            } else {
               return (
                  <li key={x.key} className={CSS.element(baseClass, x.type)}>
                     {x.content}
                  </li>
               );
            }
         });

      if (!children && data.emptyText) {
         children = <li className={CSS.element(baseClass, "empty-text")}>{data.emptyText}</li>;
      }

      return (
         <ul
            ref={(el) => {
               this.el = el as HTMLUListElement;
            }}
            className={CSS.expand(data.classNames, CSS.state({ focused: this.state.focused }))}
            style={data.style}
            tabIndex={widget.focusable && selectable && items.length > 0 ? data.tabIndex || 0 : undefined}
            onMouseDown={preventFocusOnTouch}
            onKeyDown={this.handleKeyDown.bind(this)}
            onMouseLeave={this.handleMouseLeave.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
         >
            {children}
         </ul>
      );
   }

   componentDidUpdate(): void {
      let { widget } = this.props.instance as unknown as { widget: List };
      if (widget.scrollSelectionIntoView) {
         //The timeout is reqired for use-cases when parent needs to do some measuring that affect scrollbars, i.e. LookupField.
         setTimeout(() => this.scrollElementIntoView(), 0);
      }
   }

   scrollElementIntoView(): void {
      if (!this.el) return; //unmount
      let { widget } = this.props.instance as unknown as { widget: List };
      let { CSS, baseClass } = widget;
      let selectedRowSelector = `.${CSS.element(baseClass, "item")}.${CSS.state("selected")}`;
      let firstSelectedRow = this.el.querySelector(selectedRowSelector);
      if (firstSelectedRow != this.selectedEl) {
         if (firstSelectedRow) scrollElementIntoView(firstSelectedRow, true, false, 0, this.el);
         this.selectedEl = firstSelectedRow;
      }
   }

   moveCursor(
      index: number,
      {
         focused,
         hover,
         scrollIntoView,
         select,
         selectRange,
         selectOptions,
      }: {
         focused?: boolean;
         hover?: boolean;
         scrollIntoView?: boolean;
         select?: boolean;
         selectRange?: boolean;
         selectOptions?: { toggle?: boolean; add?: boolean };
      } = {},
   ): void {
      let { instance, selectable } = this.props;
      if (!selectable) return;

      let { widget } = instance as unknown as { widget: List };
      let newState: Partial<ListComponentState> = {};
      if (widget.focused) focused = true;

      if (focused != null && this.state.focused != focused) newState.focused = focused;

      //ignore mouse enter/leave events (support with a flag if a feature request comes)
      if (!hover) newState.cursor = index;

      //batch updates to avoid flickering between selection and cursor changes
      batchUpdates(() => {
         if (select || widget.selectMode) {
            let start: number | undefined =
               selectRange && this.state.selectionStart !== undefined && this.state.selectionStart >= 0
                  ? this.state.selectionStart
                  : index;
            if (start < 0) start = index;
            this.selectRange(start, index, selectOptions);
            if (!selectRange) newState.selectionStart = index;
         }
         if (Object.keys(newState).length > 0) {
            this.setState(newState as ListComponentState, () => {
               if (scrollIntoView && this.el) {
                  let item = this.el.children[this.cursorChildIndex[index]];
                  if (item) scrollElementIntoView(item);
               }
            });
         }
      });
   }

   selectRange(from: number, to: number, options?: { toggle?: boolean; add?: boolean }): void {
      let { instance, items } = this.props;
      let { widget } = instance as unknown as { widget: List };

      if (from > to) {
         let tmp = from;
         from = to;
         to = tmp;
      }

      let selection: any[] = [],
         indexes: number[] = [];

      for (let cursor = from; cursor <= to; cursor++) {
         let item = items[this.cursorChildIndex[cursor]];
         if (item) {
            let { record, data } = item.instance as { record: any; data: any };
            if (data.disabled) continue;
            selection.push(record.data);
            indexes.push(record.index);
         }
      }

      widget.selection.selectMultiple(instance.store, selection, indexes, options);
   }

   showCursor(force?: boolean, newItems?: ListItemData[]): void {
      if (!force && this.state.cursor >= 0) return;

      let items = newItems || this.props.items;
      let index = -1,
         firstSelected = -1,
         firstValid = -1;
      for (let i = 0; i < items.length; i++) {
         let item = items[i];
         if (isDataItem(item)) {
            index++;

            if (!isItemDisabled(item) && firstValid == -1) firstValid = index;
            if ((item.instance as any).selected) {
               firstSelected = index;
               break;
            }
         }
      }
      this.moveCursor(firstSelected != -1 ? firstSelected : firstValid, {
         focused: true,
      });
   }

   onFocus(): void {
      let { widget } = this.props.instance as unknown as { widget: List };

      FocusManager.nudge();
      this.showCursor(widget.selectMode);

      if (!widget.focused && this.el)
         oneFocusOut(this, this.el, () => {
            this.moveCursor(-1, { focused: false });
         });

      this.setState({
         focused: true,
      });
   }

   onBlur(): void {
      FocusManager.nudge();
   }

   handleMouseLeave(): void {
      let { widget } = this.props.instance as unknown as { widget: List };
      if (!widget.focused) this.moveCursor(-1, { hover: true });
   }

   handleKeyDown(e: React.KeyboardEvent): void {
      let { instance, items } = this.props;
      let { widget } = instance as unknown as { widget: List };

      if (this.onKeyDown && instance.invoke("onKeyDown", e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.tab:
         case KeyCode.enter:
            if (!widget.selectOnTab && e.keyCode == KeyCode.tab) break;
            let item = items[this.cursorChildIndex[this.state.cursor]];
            if (item && widget.onItemClick && instance.invoke("onItemClick", e, item.instance) === false) return;
            this.moveCursor(this.state.cursor, {
               select: true,
               selectOptions: {
                  toggle: e.ctrlKey && !e.shiftKey,
                  add: e.ctrlKey && e.shiftKey,
               },
               selectRange: e.shiftKey,
            });
            break;

         case KeyCode.down:
            for (let index = this.state.cursor + 1; index < this.cursorChildIndex.length; index++) {
               let item = items[this.cursorChildIndex[index]];
               if (!isItemSelectable(item)) continue;
               this.moveCursor(index, {
                  focused: true,
                  scrollIntoView: true,
                  select: e.shiftKey,
                  selectRange: e.shiftKey,
               });
               e.stopPropagation();
               e.preventDefault();
               break;
            }
            break;

         case KeyCode.up:
            for (let index = this.state.cursor - 1; index >= 0; index--) {
               let item = items[this.cursorChildIndex[index]];
               if (!isItemSelectable(item)) continue;
               this.moveCursor(index, {
                  focused: true,
                  scrollIntoView: true,
                  select: e.shiftKey,
                  selectRange: e.shiftKey,
               });
               e.stopPropagation();
               e.preventDefault();
               break;
            }
            break;

         case KeyCode.a:
            if (!e.ctrlKey || !widget.selection.multiple) return;

            this.selectRange(0, this.cursorChildIndex.length);

            e.stopPropagation();
            e.preventDefault();
            break;
      }
   }
}

class ListItem extends Container {
   declareData(...args: Record<string, unknown>[]) {
      super.declareData(...args, {
         disabled: undefined,
      });
   }
}

function isItemSelectable(item: any) {
   return isDataItem(item) && !isItemDisabled(item);
}

function isDataItem(item: any) {
   return item?.type == "data";
}

function isItemDisabled(item: any) {
   return item?.instance.data.disabled;
}
