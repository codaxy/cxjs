/**@jsxImportSource react */
import { Widget, VDOM, getContent } from "../../ui/Widget";
import { Cx } from "../../ui/Cx";
import { Field, getFieldTooltip, FieldInstance } from "./Field";
import { ReadOnlyDataView } from "../../data/ReadOnlyDataView";
import { HtmlElement, HtmlElementInstance } from "../HtmlElement";
import { Binding, BindingInput } from "../../data/Binding";
import { debug } from "../../util/Debug";
import { Dropdown } from "../overlay/Dropdown";
import { FocusManager } from "../../ui/FocusManager";
import { isFocused } from "../../util/DOM";
import { isTouchDevice } from "../../util/isTouchDevice";
import { isTouchEvent } from "../../util/isTouchEvent";
import {
   tooltipParentWillReceiveProps,
   tooltipParentWillUnmount,
   tooltipMouseMove,
   tooltipMouseLeave,
   tooltipParentDidMount,
} from "../overlay/tooltip-ops";
import { stopPropagation, preventDefault } from "../../util/eventCallbacks";
import ClearIcon from "../icons/clear";
import DropdownIcon from "../icons/drop-down";
import { getSearchQueryPredicate } from "../../util/getSearchQueryPredicate";
import { KeyCode } from "../../util/KeyCode";
import { Localization } from "../../ui/Localization";
import { StringTemplate } from "../../data/StringTemplate";
import { Icon } from "../Icon";
import { isString } from "../../util/isString";
import { isDefined } from "../../util/isDefined";
import { isArray } from "../../util/isArray";
import { isNonEmptyArray } from "../../util/isNonEmptyArray";
import { addEventListenerWithOptions } from "../../util/addEventListenerWithOptions";
import { List } from "../List";
import { Selection } from "../../ui/selection/Selection";
import { HighlightedSearchText } from "../HighlightedSearchText";
import { autoFocus } from "../autoFocus";
import { bind } from "../../ui";
import { AccessorChain, isAccessorChain } from "../../data/createAccessorModelProxy";
import type { CxChild, RenderingContext } from "../../ui/RenderingContext";
import type { DropdownInstance, Instance } from "../../ui/Instance";
import { FieldConfig } from "./Field";
import { Prop, BooleanProp, StringProp, DataRecord } from "../../ui/Prop";

export interface LookupBinding {
   local: string;
   remote: string;
   key?: boolean;
}

export interface LookupFieldConfig extends FieldConfig {
   multiple?: BooleanProp;
   value?: Prop<number | string>;
   values?: Prop<(number | string)[]>;
   records?: Prop<Record<string, any>[]>;
   text?: StringProp;
   enabled?: BooleanProp;
   placeholder?: StringProp;
   options?: Prop<Record<string, any>[]>;
   hideClear?: boolean;
   showClear?: boolean;
   alwaysShowClear?: boolean;
   baseClass?: string;
   itemConfig?: any;
   bindings?: LookupBinding[];
   queryDelay?: number;
   minQueryLength?: number;
   hideSearchField?: boolean;
   minOptionsForSearchField?: number;
   loadingText?: string;
   queryErrorText?: string;
   noResultsText?: string;
   optionIdField?: string;
   optionTextField?: string;
   valueIdField?: string;
   valueTextField?: string;
   fetchAll?: boolean;
   cacheAll?: boolean;
   closeOnSelect?: boolean;
   minQueryLengthMessageText?: string;
   onQuery?:
      | string
      | ((
           query: string | { query: string; page: number; pageSize: number },
           instance: Instance,
        ) => Record<string, any>[] | Promise<Record<string, any>[]>);
   sort?: boolean;
   listOptions?: Record<string, any>;
   autoOpen?: BooleanProp;
   submitOnEnterKey?: BooleanProp;
   submitOnDropdownEnterKey?: BooleanProp;
   pageSize?: number;
   infinite?: boolean;
   quickSelectAll?: boolean;
   onGetRecordDisplayText?: ((record: Record<string, any>, instance: Instance) => string) | null;
   onCreateVisibleOptionsFilter?:
      | string
      | ((filterParams: unknown, instance: Instance) => (option: Record<string, any>) => boolean);
}

export class LookupField<Config extends LookupFieldConfig = LookupFieldConfig> extends Field<Config> {
   declare public baseClass: string;
   public multiple!: boolean;
   public hideClear?: boolean;
   public showClear!: boolean;
   public alwaysShowClear!: boolean;
   public hideSearchField!: boolean;
   public minOptionsForSearchField!: number;
   public loadingText!: string;
   public queryErrorText!: string;
   public noResultsText!: string;
   public optionIdField!: string;
   public optionTextField!: string;
   public valueIdField!: string;
   public valueTextField!: string;
   public fetchAll!: boolean;
   public cacheAll!: boolean;
   public closeOnSelect!: boolean;
   public minQueryLengthMessageText: string;
   public sort?: boolean;
   public listOptions?: Record<string, any> | null;
   public autoOpen?: boolean;
   public submitOnEnterKey?: boolean;
   public submitOnDropdownEnterKey?: boolean;
   public pageSize: number;
   public infinite?: boolean;
   public quickSelectAll?: boolean;
   public queryDelay!: number;
   public minQueryLength!: number;
   public onGetRecordDisplayText?: ((record: Record<string, any>, instance: Instance) => string) | null;
   public onQuery?:
      | string
      | ((
           params: string | { query: string; page: number; pageSize: number },
           instance: Instance,
        ) => Promise<Record<string, any>[]> | Record<string, any>[]);
   public onCreateVisibleOptionsFilter?:
      | string
      | ((filterParams: unknown, instance: Instance) => (option: Record<string, any>) => boolean);
   public value?: BindingInput;
   public text?: BindingInput<string>;
   public records?: Record<string, any>[];
   public values?: unknown[];
   public options?: Record<string, any>[];

   public enabled?: boolean;
   public placeholder?: string;
   public readOnly?: boolean;
   public dropdownOptions?: Record<string, any>;
   public bindings?: BindingConfig[];
   public keyBindings?: BindingConfig[];
   public itemConfig?: CxChild;

   declareData(...args: Record<string, any>[]): void {
      let additionalAttributes = this.multiple
         ? { values: undefined, records: undefined }
         : { value: undefined, text: undefined };

      super.declareData(
         {
            disabled: undefined,
            enabled: undefined,
            placeholder: undefined,
            required: undefined,
            options: undefined,
            icon: undefined,
            autoOpen: undefined,
            readOnly: undefined,
            filterParams: { structured: true },
         },
         additionalAttributes,
         ...args,
      );
   }

   init(): void {
      if (isDefined(this.hideClear)) this.showClear = !this.hideClear;

      if (this.alwaysShowClear) this.showClear = true;

      if (!this.bindings) {
         let b: BindingConfig[] = [];
         if (this.value) {
            if (isAccessorChain(this.value)) this.value = bind(this.value);
            if ((this.value as any).bind)
               b.push({
                  key: true,
                  local: (this.value as any).bind,
                  remote: `$option.${this.optionIdField}`,
                  set: (this.value as any).set,
               });
         }

         if (this.text as string | AccessorChain<unknown>) {
            if (isAccessorChain(this.text)) this.text = bind(this.text);
            if ((this.text as any).bind)
               b.push({
                  local: (this.text as any).bind,
                  remote: `$option.${this.optionTextField}`,
                  set: (this.text as any).set,
               });
         }

         this.bindings = b;
      }

      if (this.bindings.length == 0 && this.multiple)
         this.bindings = [
            {
               key: true,
               local: `$value.${this.valueIdField}`,
               remote: `$option.${this.optionIdField}`,
            },
            {
               local: `$value.${this.valueTextField}`,
               remote: `$option.${this.optionTextField}`,
            },
         ];

      this.keyBindings = this.bindings.filter((b) => b.key);

      if (!this.items && !this.children)
         this.items = {
            type: HighlightedSearchText,
            text: { bind: `$option.${this.optionTextField}` },
            query: { bind: "$query" },
         } as any;

      this.itemConfig = this.children || this.items;

      delete this.items;
      delete this.children;

      super.init();
   }

   prepareData(context: RenderingContext, instance: FieldInstance<LookupField>): void {
      let { data, store } = instance;

      data.stateMods = {
         multiple: this.multiple,
         single: !this.multiple,
         disabled: data.disabled,
         readonly: data.readOnly,
      };

      data.visibleOptions = data.options;
      if (this.onCreateVisibleOptionsFilter && isArray(data.options)) {
         let filterPredicate = instance.invoke("onCreateVisibleOptionsFilter", data.filterParams, instance);
         data.visibleOptions = data.options.filter(filterPredicate);
      }

      data.selectedKeys = [];

      if (this.multiple) {
         if (isArray(data.values) && isArray(data.options)) {
            data.selectedKeys = data.values.map((v) => (this.keyBindings!.length == 1 ? [v] : v));
            let map: Record<number, Record<string, any>> = {};
            data.options.filter(($option) => {
               let optionKey = getOptionKey(this.keyBindings!, { $option });
               for (let i = 0; i < data.selectedKeys.length; i++)
                  if (areKeysEqual(optionKey, data.selectedKeys[i])) {
                     map[i] = convertOption(this.bindings!, { $option });
                     break;
                  }
            });
            data.records = [];
            for (let i = 0; i < data.selectedKeys.length; i++) if (map[i]) data.records.push(map[i]);
         } else if (isArray(data.records))
            data.selectedKeys.push(
               ...data.records.map(($value) => this.keyBindings!.map((b) => Binding.get(b.local).value({ $value }))),
            );
      } else {
         let dataViewData = store.getData();
         data.selectedKeys.push(this.keyBindings!.map((b) => Binding.get(b.local).value(dataViewData)));
         if (!this.text && isArray(data.options)) {
            let option = data.options.find(($option) =>
               areKeysEqual(getOptionKey(this.keyBindings!, { $option }), data.selectedKeys[0]),
            );
            data.text = (option && (option as any)[this.optionTextField!]) || "";
         }
      }

      (instance as DropdownInstance).lastDropdown = context.lastDropdown;

      super.prepareData(context, instance);
   }

   renderInput(context: RenderingContext, instance: FieldInstance<LookupField>, key: string): React.ReactNode {
      return (
         <LookupComponent
            key={key}
            multiple={this.multiple!}
            instance={instance}
            itemConfig={this.itemConfig}
            bindings={this.bindings!}
            baseClass={this.baseClass!}
            label={this.labelPlacement && getContent(this.renderLabel(context, instance, "label"))}
            help={this.helpPlacement && getContent(this.renderHelp(context, instance, "help"))}
            forceUpdate={context.forceUpdate}
            icon={this.renderIcon(context, instance, "icon")}
         />
      );
   }

   filterOptions(instance: Instance, options: DataRecord[], query?: string): DataRecord[] {
      if (!query) return options;
      let textPredicate = getSearchQueryPredicate(query);
      return options.filter(
         (o) => isString(o[this.optionTextField!]) && textPredicate((o as any)[this.optionTextField!] as string),
      );
   }

   isEmpty(data: Record<string, any>): boolean {
      if (this.multiple) return !isNonEmptyArray(data.values) && !isNonEmptyArray(data.records);
      return super.isEmpty(data);
   }

   getValidationValue(data: Record<string, any>): unknown {
      if (this.multiple) return data.records ?? data.values;
      return super.getValidationValue(data);
   }

   formatValue(context: RenderingContext, instance: Instance): string | React.ReactNode {
      if (!this.multiple) return super.formatValue(context, instance);

      let { records, values, options } = instance.data;
      if (isArray(records)) {
         let valueTextFormatter =
            typeof this.onGetRecordDisplayText === "function"
               ? this.onGetRecordDisplayText
               : (record: Record<string, any>) =>
                    (record as any)[this.valueTextField!] || (record as any)[this.valueIdField!];
         return records.map((record) => valueTextFormatter(record as any, instance));
      }

      if (isArray(values)) {
         if (isArray(options))
            return values
               .map((id) => {
                  let option = options.find((o) => (o as any)[this.optionIdField!] == id);
                  return option ? (option as any)[this.valueTextField!] : id;
               })
               .filter(Boolean)
               .join(", ");

         return values.join(", ");
      }

      return null;
   }
}

LookupField.prototype.baseClass = "lookupfield";
//LookupField.prototype.memoize = false;
LookupField.prototype.multiple = false;
LookupField.prototype.queryDelay = 150;
LookupField.prototype.minQueryLength = 0;
LookupField.prototype.hideSearchField = false;
LookupField.prototype.minOptionsForSearchField = 7;
LookupField.prototype.loadingText = "Loading...";
LookupField.prototype.queryErrorText = "Error occurred while querying for lookup data.";
LookupField.prototype.noResultsText = "No results found.";
LookupField.prototype.optionIdField = "id";
LookupField.prototype.optionTextField = "text";
LookupField.prototype.valueIdField = "id";
LookupField.prototype.valueTextField = "text";
LookupField.prototype.suppressErrorsUntilVisited = true;
LookupField.prototype.fetchAll = false;
LookupField.prototype.cacheAll = false;
LookupField.prototype.showClear = true;
LookupField.prototype.alwaysShowClear = false;
LookupField.prototype.closeOnSelect = true;
LookupField.prototype.minQueryLengthMessageText = "Type in at least {0} character(s).";
LookupField.prototype.icon = null;
LookupField.prototype.sort = false;
LookupField.prototype.listOptions = null;
LookupField.prototype.autoOpen = false;
LookupField.prototype.submitOnEnterKey = false;
LookupField.prototype.submitOnDropdownEnterKey = false;
LookupField.prototype.pageSize = 100;
LookupField.prototype.infinite = false;
LookupField.prototype.quickSelectAll = false;
LookupField.prototype.onGetRecordDisplayText = null;

Localization.registerPrototype("cx/widgets/LookupField", LookupField);

Widget.alias("lookupfield", LookupField);

interface BindingConfig {
   local: string;
   remote: string;
   key?: boolean;
   set?: (value: unknown, instance: Instance) => void;
}

function getOptionKey(bindings: BindingConfig[], data: Record<string, any>): unknown[] {
   return bindings.filter((a) => a.key).map((b) => Binding.get(b.remote).value(data));
}

function areKeysEqual(key1: unknown[], key2: unknown[]): boolean {
   if (!key1 || !key2 || key1.length != key2.length) return false;

   for (let i = 0; i < key1.length; i++) if (key1[i] !== key2[i]) return false;

   return true;
}

function convertOption(bindings: BindingConfig[], data: Record<string, any>): Record<string, any> {
   let result: Record<string, any> = { $value: {} };
   bindings.forEach((b) => {
      let value = Binding.get(b.remote).value(data);
      result = Binding.get(b.local).set(result, value);
   });
   return result.$value as Record<string, any>;
}

class SelectionDelegate extends Selection {
   delegate: (record: Record<string, any>, index: number) => boolean;

   constructor({ delegate }: { delegate: (record: Record<string, any>, index: number) => boolean }) {
      super();
      this.delegate = delegate;
   }

   getIsSelectedDelegate(store: unknown): (record: Record<string, any>, index: number) => boolean {
      return (record: Record<string, any>, index: number) => this.delegate(record, index);
   }

   select(): boolean {
      return false;
   }
}

interface LookupComponentProps {
   instance: FieldInstance<LookupField>;
   multiple: boolean;
   itemConfig: unknown;
   bindings: BindingConfig[];
   baseClass: string;
   label?: React.ReactNode;
   help?: React.ReactNode;
   forceUpdate: () => void;
   icon?: React.ReactNode;
}

interface LookupComponentState {
   options: unknown[];
   formatted?: string;
   value?: string;
   dropdownOpen: boolean;
   focus: boolean;
   status?: string;
   message?: string;
   query?: string;
   page?: number;
   hover?: boolean;
}

class LookupComponent extends VDOM.Component<LookupComponentProps, LookupComponentState> {
   dom: {
      input?: HTMLDivElement | null;
      dropdown?: HTMLDivElement | null;
      list?: HTMLDivElement | null;
      query?: HTMLInputElement | null;
   } = {};
   itemStore: ReadOnlyDataView;
   dropdown?: Widget;
   list?: Widget;
   listKeyDown?: (e: React.KeyboardEvent) => void;
   queryTimeoutId?: ReturnType<typeof setTimeout>;
   cachedResult?: Record<string, any>[];
   tmpCachedResult?: Record<string, any>[];
   lastQueryId?: number;
   lastQuery?: string;
   extraPageLoadingBlocker?: string | false;
   unsubscribeListOnWheel?: (() => void) | null;
   unsubscribeListOnScroll?: (() => void) | null;

   constructor(props: LookupComponentProps) {
      super(props);
      let { data, store } = this.props.instance;
      this.dom = {};
      this.state = {
         options: [],
         formatted: data.formatted,
         value: data.formatted,
         dropdownOpen: false,
         focus: false,
      };

      this.itemStore = new ReadOnlyDataView({
         store: store,
      });
   }

   getOptionKey(data: Record<string, any>): unknown[] {
      return this.props.bindings.filter((a) => a.key).map((b) => Binding.get(b.remote).value(data));
   }

   getLocalKey(data: Record<string, any>): unknown[] {
      return this.props.bindings.filter((a) => a.key).map((b) => Binding.get(b.local).value(data));
   }

   findOption(options: Record<string, any>[], key: unknown[]): number {
      if (!key) return -1;
      for (let i = 0; i < options.length; i++) {
         let optionKey = this.getOptionKey({ $option: options[i] });
         if (areKeysEqual(key, optionKey)) return i;
      }
      return -1;
   }

   getDropdown(): Widget {
      if (this.dropdown) return this.dropdown;

      let { widget }: { widget: LookupField } = this.props.instance as unknown as { widget: LookupField };
      let { lastDropdown } = this.props.instance as DropdownInstance;

      this.list = Widget.create({
         type: List,
         sortField: widget.sort && widget.optionTextField,
         sortDirection: "ASC",
         mod: "dropdown",
         scrollSelectionIntoView: true,
         cached: widget.infinite,
         ...widget.listOptions,
         records: bind("$options"),
         recordName: "$option",
         onItemClick: (e: React.MouseEvent, inst: Instance) => this.onItemClick(e, inst),
         pipeKeyDown: (kd: (e: React.KeyboardEvent) => void) => {
            this.listKeyDown = kd;
         },
         selectOnTab: true,
         focusable: false,
         selection: {
            type: SelectionDelegate,
            delegate: (data: any) =>
               this.props.instance.data.selectedKeys.find((x: any) =>
                  areKeysEqual(x, this.getOptionKey({ $option: data })),
               ) != null,
         },
         children: this.props.itemConfig,
      });

      let dropdown = {
         constrain: true,
         scrollTracking: true,
         inline: !isTouchDevice() || !!lastDropdown,
         placementOrder: "down-right down-left up-right up-left",
         ...widget.dropdownOptions,
         type: Dropdown,
         relatedElement: this.dom.input,
         renderChildren: () => this.renderDropdownContents(),
         onFocusOut: (e: React.MouseEvent) => this.closeDropdown(e),
         memoize: false,
         touchFriendly: isTouchDevice(),
         onMeasureNaturalContentSize: () => {
            if (this.dom.dropdown && this.dom.list) {
               return {
                  height:
                     this.dom.dropdown.offsetHeight -
                     this.dom.list.offsetHeight +
                     ((this.dom.list.firstElementChild as HTMLElement)?.offsetHeight || 0),
               };
            }
         },
         onDismissAfterScroll: () => {
            this.closeDropdown(null, true);
            return false;
         },
      };

      return (this.dropdown = Widget.create(dropdown));
   }

   renderDropdownContents(): React.ReactNode {
      let content;
      let { instance } = this.props;
      let { data, widget }: { data: Record<string, any>; widget: LookupField } = instance as unknown as {
         data: Record<string, any>;
         widget: LookupField;
      };
      let { CSS, baseClass } = widget;

      let searchVisible =
         !widget.hideSearchField &&
         (!isArray(data.visibleOptions) ||
            (widget.minOptionsForSearchField && data.visibleOptions.length >= widget.minOptionsForSearchField));

      if (this.state.status == "loading") {
         content = (
            <div key="msg" className={CSS.element(baseClass, "message", "loading")}>
               {widget.loadingText}
            </div>
         );
      } else if (this.state.status == "error") {
         content = (
            <div key="msg" className={CSS.element(baseClass, "message", "error")}>
               {widget.queryErrorText}
            </div>
         );
      } else if (this.state.status == "info") {
         content = (
            <div key="msg" className={CSS.element(baseClass, "message", "info")}>
               {this.state.message}
            </div>
         );
      } else if (this.state.options.length == 0) {
         content = (
            <div key="msg" className={CSS.element(baseClass, "message", "no-results")}>
               {widget.noResultsText}
            </div>
         );
      } else {
         content = (
            <div
               key="msg"
               ref={(el) => {
                  this.dom.list = el;
                  this.subscribeListOnWheel(el);
                  this.subscribeListOnScroll(el);
               }}
               className={CSS.element(baseClass, "scroll-container")}
            >
               <Cx widget={this.list} store={this.itemStore} options={{ name: "lookupfield-list" }} />
            </div>
         );
      }

      return (
         <div
            key="dropdown"
            ref={(el) => {
               this.dom.dropdown = el as HTMLDivElement;
            }}
            className={CSS.element(baseClass, "dropdown")}
            tabIndex={0}
            onFocus={(e) => this.onDropdownFocus(e)}
            onKeyDown={(e) => this.onDropdownKeyPress(e)}
         >
            {searchVisible && (
               <input
                  key="query"
                  ref={(el) => {
                     this.dom.query = el as HTMLInputElement;
                  }}
                  type="text"
                  className={CSS.element(baseClass, "query")}
                  onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                  }}
                  onChange={(e) => this.query(e.target.value)}
                  onBlur={(e) => this.onQueryBlur(e)}
               />
            )}
            {content}
         </div>
      );
   }

   onListWheel(e: WheelEvent): void {
      let { list } = this.dom;
      if (
         list &&
         ((list.scrollTop + list.offsetHeight == list.scrollHeight && e.deltaY > 0) ||
            (list.scrollTop == 0 && e.deltaY < 0))
      ) {
         e.preventDefault();
         e.stopPropagation();
      }
   }

   onListScroll(): void {
      if (!this.dom.list) return;
      var el = this.dom.list;
      if (el.scrollTop > el.scrollHeight - 2 * el.offsetHeight) {
         this.loadAdditionalOptionPages();
      }
   }

   onDropdownFocus(e: React.FocusEvent): void {
      if (this.dom.query && !isFocused(this.dom.query) && !isTouchDevice()) FocusManager.focus(this.dom.query);
   }

   getPlaceholder(text?: string): React.ReactNode {
      let { CSS, baseClass } = this.props.instance.widget;

      if (text) return <span className={CSS.element(baseClass, "placeholder")}>{text}</span>;

      return <span className={CSS.element(baseClass, "placeholder")}>&nbsp;</span>;
   }

   render(): React.ReactNode {
      let { instance, label, help, icon: iconVDOM } = this.props;
      let { data, widget, state } = instance;
      let { CSS, baseClass, suppressErrorsUntilVisited } = widget as LookupField;

      let icon = iconVDOM && (
         <div
            key="icon"
            className={CSS.element(baseClass, "left-icon")}
            onMouseDown={preventDefault}
            onClick={(e) => {
               this.openDropdown(e);
               e.stopPropagation();
               e.preventDefault();
            }}
         >
            {iconVDOM}
         </div>
      );

      let dropdown;
      if (this.state.dropdownOpen) {
         this.itemStore.setData({
            $options: this.state.options,
            $query: this.lastQuery,
         });
         dropdown = (
            <Cx widget={this.getDropdown()} store={this.itemStore} options={{ name: "lookupfield-dropdown" }} />
         );
      }

      let insideButton = null;
      let multipleEntries = this.props.multiple && isArray(data.records) && data.records.length > 1;

      if (!data.readOnly) {
         if (
            widget.showClear &&
            !data.disabled &&
            !data.empty &&
            (widget.alwaysShowClear || (!data.required && !this.props.multiple) || multipleEntries)
         ) {
            insideButton = (
               <div
                  key="ib"
                  onMouseDown={preventDefault}
                  onClick={(e) => (!this.props.multiple ? this.onClearClick(e) : this.onClearMultipleClick(e))}
                  className={CSS.element(baseClass, "clear")}
               >
                  <ClearIcon className={CSS.element(baseClass, "icon")} />
               </div>
            );
         } else {
            insideButton = (
               <div
                  key="ib"
                  className={CSS.element(baseClass, "tool")}
                  onMouseDown={preventDefault}
                  onClick={(e) => {
                     this.toggleDropdown(e, true);
                     e.stopPropagation();
                     e.preventDefault();
                  }}
               >
                  <DropdownIcon className={CSS.element(baseClass, "icon")} />
               </div>
            );
         }
      }

      let text;

      if (this.props.multiple) {
         let readOnly = data.disabled || data.readOnly;
         if (isNonEmptyArray(data.records)) {
            let valueTextFormatter =
               widget.onGetRecordDisplayText ??
               ((record: Record<string, any>) => record[widget.valueTextField] as string);
            text = data.records.map((v, i) => (
               <div
                  key={i}
                  className={CSS.element(baseClass, "tag", {
                     readonly: readOnly,
                  })}
               >
                  <span className={CSS.element(baseClass, "tag-value")}>{valueTextFormatter(v, instance)}</span>
                  {!readOnly && (
                     <div
                        className={CSS.element(baseClass, "tag-clear")}
                        onMouseDown={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                        }}
                        onClick={(e) => this.onClearClick(e, v)}
                     >
                        <ClearIcon className={CSS.element(baseClass, "icon")} />
                     </div>
                  )}
               </div>
            ));
         } else {
            text = this.getPlaceholder(data.placeholder);
         }
      } else {
         text = !data.empty ? data.text || this.getPlaceholder() : this.getPlaceholder(data.placeholder);
      }

      let states = {
         visited: state.visited,
         focus: this.state.focus || this.state.dropdownOpen,
         icon: !!iconVDOM,
         empty: !data.placeholder && data.empty,
         error: data.error && (state.visited || !suppressErrorsUntilVisited || !data.empty),
      };

      return (
         <div
            className={CSS.expand(data.classNames, CSS.state(states))}
            style={data.style}
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
            onKeyDown={(e) => this.onKeyDown(e)}
         >
            <div
               id={data.id}
               className={CSS.expand(CSS.element(widget.baseClass, "input"), data.inputClass)}
               style={data.inputStyle}
               tabIndex={data.disabled ? null : data.tabIndex || 0}
               ref={(el) => {
                  this.dom.input = el;
               }}
               aria-labelledby={data.id + "-label"}
               onMouseMove={(e) => tooltipMouseMove(e, ...getFieldTooltip(this.props.instance))}
               onMouseLeave={(e) => tooltipMouseLeave(e, ...getFieldTooltip(this.props.instance))}
               onClick={(e) => this.onClick(e)}
               onKeyDown={(e) => this.onInputKeyDown(e)}
               onMouseDown={(e) => this.onMouseDown(e)}
               onBlur={(e) => this.onBlur(e)}
               onFocus={(e) => this.onFocus(e)}
            >
               {text}
            </div>
            {insideButton}
            {icon}
            {dropdown}
            {label}
            {help}
         </div>
      );
   }

   onMouseDown(e: React.MouseEvent): void {
      //skip touch start to allow touch scrolling
      if (isTouchEvent()) return;
      e.preventDefault();
      e.stopPropagation();
      this.toggleDropdown(e, true);
   }

   onClick(e: React.MouseEvent): void {
      //mouse down will handle it for non-touch events
      if (!isTouchEvent()) return;
      e.preventDefault();
      e.stopPropagation();
      this.toggleDropdown(e, true);
   }

   onItemClick(
      e: React.KeyboardEvent | React.MouseEvent,
      { store }: { store: { getData: () => Record<string, any> } },
   ): void {
      this.select(e, [store.getData()]);
      if (!this.props.instance.widget.submitOnEnterKey || e.type != "keydown") e.stopPropagation();
      if ((e as React.KeyboardEvent).keyCode != KeyCode.tab) e.preventDefault();
   }

   onClearClick(e: React.MouseEvent | React.KeyboardEvent, value?: Record<string, any>): void {
      let { instance } = this.props;
      let { data, store, widget } = instance;
      let { keyBindings } = widget;
      e.stopPropagation();
      e.preventDefault();
      if (widget.multiple) {
         if (isArray(data.records)) {
            let itemKey = this.getLocalKey({ $value: value });
            let newRecords = data.records.filter((v) => !areKeysEqual(this.getLocalKey({ $value: v }), itemKey));

            instance.set("records", newRecords);

            let newValues = newRecords
               .map((rec) => this.getLocalKey({ $value: rec }))
               .map((k) => (keyBindings!.length == 1 ? k[0] : k));

            instance.set("values", newValues);
         }
      } else {
         this.props.bindings.forEach((b) => {
            store.set(b.local, widget.emptyValue);
         });
      }

      if (!isTouchEvent()) this.dom.input!.focus();
   }

   onClearMultipleClick(e: React.MouseEvent): void {
      let { instance } = this.props;
      instance.set("records", []);
      instance.set("values", []);
   }

   select(e: React.KeyboardEvent | React.MouseEvent, itemsData: Record<string, any>[], reset?: boolean): void {
      let { instance } = this.props;
      let { store, data, widget } = instance;
      let { bindings, keyBindings } = widget;

      if (widget.multiple) {
         let { selectedKeys, records } = data;

         let newRecords = reset ? [] : [...(records || [])];
         let singleSelect = itemsData.length == 1;
         let optionKey: unknown[] | null = null;
         if (singleSelect) optionKey = this.getOptionKey(itemsData[0]);

         // deselect
         if (singleSelect && selectedKeys.find((k: any) => areKeysEqual(optionKey!, k))) {
            newRecords = records.filter((v: any) => !areKeysEqual(optionKey!, this.getLocalKey({ $value: v })));
         } else {
            itemsData.forEach((itemData) => {
               let valueData: Record<string, any> = {
                  $value: {},
               };
               bindings!.forEach((b) => {
                  valueData = Binding.get(b.local).set(valueData, Binding.get(b.remote).value(itemData));
               });
               newRecords.push(valueData.$value as Record<string, any>);
            });
         }

         instance.set("records", newRecords);

         let newValues = newRecords
            .map((rec) => this.getLocalKey({ $value: rec }))
            .map((k) => (keyBindings!.length == 1 ? k[0] : k));

         instance.set("values", newValues);
      } else {
         bindings!.forEach((b) => {
            let v = Binding.get(b.remote).value(itemsData[0]);
            if (b.set) b.set(v, instance);
            else store.set(b.local, v);
         });
      }

      if (widget.closeOnSelect) {
         //Pressing Tab should work it's own thing. Focus will move elsewhere and the dropdown will close.
         if ((e as React.KeyboardEvent).keyCode != KeyCode.tab) {
            if (!isTouchEvent()) this.dom.input!.focus();
            this.closeDropdown(e);
         }
      }

      if ((e as React.KeyboardEvent).keyCode == KeyCode.enter && widget.submitOnDropdownEnterKey) {
         this.submitOnEnter(e as React.KeyboardEvent);
      }
   }

   onDropdownKeyPress(e: React.KeyboardEvent): void {
      switch (e.keyCode) {
         case KeyCode.esc:
            this.closeDropdown(e);
            this.dom.input!.focus();
            break;

         case KeyCode.tab:
            // if tab needs to do a list selection, we have to first call List's handleKeyDown
            if (this.listKeyDown) this.listKeyDown(e);
            // if next focusable element is disabled, recalculate and update the dom before switching focus
            this.props.forceUpdate();
            break;

         case KeyCode.a:
            if (!e.ctrlKey) return;

            let { quickSelectAll, multiple } = this.props.instance.widget;
            if (!quickSelectAll || !multiple) return;

            let optionsToSelect = this.state.options.map((o) => ({
               $option: o,
            }));
            this.select(e, optionsToSelect, true);
            e.stopPropagation();
            e.preventDefault();
            break;

         default:
            if (this.listKeyDown) this.listKeyDown(e);
            break;
      }
   }

   onKeyDown(e: React.KeyboardEvent): void {
      switch (e.keyCode) {
         case KeyCode.pageDown:
         case KeyCode.pageUp:
            if (this.state.dropdownOpen) e.preventDefault();
            break;
      }
   }

   onInputKeyDown(e: React.KeyboardEvent): void {
      let { instance } = this.props;
      if (instance.widget.handleKeyDown(e, instance) === false) return;

      switch (e.keyCode) {
         case KeyCode.delete:
            this.onClearClick(e);
            return;

         case KeyCode.shift:
         case KeyCode.ctrl:
         case KeyCode.tab:
         case KeyCode.left:
         case KeyCode.right:
         case KeyCode.pageUp:
         case KeyCode.pageDown:
         case KeyCode.insert:
         case KeyCode.esc:
            break;

         case KeyCode.down:
            this.openDropdown(e);
            e.stopPropagation();
            break;

         case KeyCode.enter:
            if (this.props.instance.widget.submitOnEnterKey) {
               this.submitOnEnter(e);
            } else {
               this.openDropdown(e);
            }
            break;

         default:
            this.openDropdown(e);
            break;
      }
   }

   onQueryBlur(e: React.FocusEvent): void {
      FocusManager.nudge();
   }

   onFocus(e: React.FocusEvent): void {
      let { instance } = this.props;
      let { widget } = instance;
      if (widget.trackFocus) {
         this.setState({
            focus: true,
         });
      }

      if (this.props.instance.data.autoOpen) this.openDropdown(null);
   }

   onBlur(e: React.FocusEvent): void {
      if (!this.state.dropdownOpen) this.props.instance.setState({ visited: true });

      if (this.state.focus)
         this.setState({
            focus: false,
         });
   }

   toggleDropdown(e: React.KeyboardEvent | React.MouseEvent, keepFocus?: boolean): void {
      if (this.state.dropdownOpen) this.closeDropdown(e, keepFocus);
      else this.openDropdown(e);
   }

   closeDropdown(e?: React.KeyboardEvent | React.MouseEvent | null, keepFocus?: boolean): void {
      if (this.state.dropdownOpen) {
         this.setState(
            {
               dropdownOpen: false,
            },
            () => keepFocus && this.dom.input?.focus(),
         );

         this.props.instance.setState({
            visited: true,
         });
      }

      //delete results valid only while the dropdown is open
      delete this.tmpCachedResult;
   }

   openDropdown(e: React.KeyboardEvent | React.MouseEvent | null): void {
      let { instance } = this.props;
      let { data } = instance;
      if (!this.state.dropdownOpen && !data.disabled && !data.readOnly) {
         this.query("");
         this.setState(
            {
               dropdownOpen: true,
            },
            () => {
               if (this.dom.dropdown) this.dom.dropdown.focus();
            },
         );
      }
   }

   query(q: string): void {
      /*
       In fetchAll mode onQuery should fetch all data and after
       that everything is done filtering is done client-side.
       If cacheAll is set results are cached for the lifetime of the
       widget, otherwise cache is invalidated when dropdown closes.
       */

      let { instance } = this.props;
      let { widget, data } = instance;

      this.lastQuery = q;

      //do not make duplicate queries if fetchAll is enabled
      if (widget.fetchAll && this.state.status == "loading") return;

      if (this.queryTimeoutId) clearTimeout(this.queryTimeoutId);

      if (q.length < widget.minQueryLength) {
         this.setState({
            status: "info",
            message: StringTemplate.format(widget.minQueryLengthMessageText, widget.minQueryLength),
         });
         return;
      }

      if (isArray(data.visibleOptions)) {
         let results = widget.filterOptions(this.props.instance, data.visibleOptions as DataRecord[], q);
         this.setState({
            options: results,
            status: "loaded",
         });
      }

      if (widget.onQuery) {
         let { queryDelay, fetchAll, cacheAll, pageSize } = widget;

         if (fetchAll) queryDelay = 0;

         if (!this.cachedResult) {
            this.setState({
               status: "loading",
            });
         }

         this.queryTimeoutId = setTimeout(() => {
            delete this.queryTimeoutId;

            let result = this.tmpCachedResult || this.cachedResult;
            let query = fetchAll ? "" : q;
            let params = !widget.infinite
               ? query
               : {
                    query,
                    page: 1,
                    pageSize,
                 };

            if (!result) result = instance.invoke("onQuery", params, instance);

            let queryId = (this.lastQueryId = Date.now());

            Promise.resolve(result)
               .then((results) => {
                  //discard results which do not belong to the last query
                  if (queryId !== this.lastQueryId) return;

                  if (!isArray(results)) results = [];

                  if (fetchAll) {
                     if (cacheAll) this.cachedResult = results;
                     else this.tmpCachedResult = results;

                     results = widget.filterOptions(this.props.instance, results, this.lastQuery);
                  }

                  this.setState(
                     {
                        page: 1,
                        query,
                        options: results,
                        status: "loaded",
                     },
                     () => {
                        if (widget.infinite) this.onListScroll();
                     },
                  );
               })
               .catch((err) => {
                  this.setState({ status: "error" });
                  debug("Lookup query error:", err);
               });
         }, queryDelay);
      }
   }

   loadAdditionalOptionPages(): void {
      let { instance } = this.props;
      let { widget } = instance;
      if (!widget.infinite) return;

      let { query, page, status, options } = this.state;
      if (!page) page = 1;

      let blockerKey = query;

      if (status != "loaded") return;

      if (options.length < page * widget.pageSize) return; //some pages were not full which means we reached the end

      if (this.extraPageLoadingBlocker === blockerKey) return;

      this.extraPageLoadingBlocker = blockerKey;

      let params = {
         page: page + 1,
         query,
         pageSize: widget.pageSize,
      };

      var result = instance.invoke("onQuery", params, instance);

      Promise.resolve(result)
         .then((results) => {
            //discard results which do not belong to the last query
            if (this.extraPageLoadingBlocker !== blockerKey) return;

            this.extraPageLoadingBlocker = false;

            if (!isArray(results)) return;

            this.setState(
               {
                  page: params.page,
                  query,
                  options: [...options, ...results],
               },
               () => {
                  this.onListScroll();
               },
            );
         })
         .catch((err) => {
            if (this.extraPageLoadingBlocker !== blockerKey) return;
            this.extraPageLoadingBlocker = false;
            this.setState({ status: "error" });
            debug("Lookup query error:", err);
            console.error(err);
         });
   }

   UNSAFE_componentWillReceiveProps(props: LookupComponentProps): void {
      if (this.dom.input) {
         tooltipParentWillReceiveProps(this.dom.input, ...getFieldTooltip(props.instance));
      }
   }

   componentDidMount(): void {
      if (this.dom.input) {
         tooltipParentDidMount(this.dom.input, ...getFieldTooltip(this.props.instance));
         autoFocus(this.dom.input, this);
      }
   }

   componentDidUpdate(): void {
      if (this.dom.input) {
         autoFocus(this.dom.input, this);
      }
   }

   componentWillUnmount(): void {
      if (this.queryTimeoutId) clearTimeout(this.queryTimeoutId);
      tooltipParentWillUnmount(this.props.instance);
      this.subscribeListOnWheel(null);
   }

   subscribeListOnWheel(list: HTMLDivElement | null): void {
      if (this.unsubscribeListOnWheel) {
         this.unsubscribeListOnWheel();
         this.unsubscribeListOnWheel = null;
      }
      if (list) {
         this.unsubscribeListOnWheel = addEventListenerWithOptions(
            list,
            "wheel",
            (e) => this.onListWheel(e as WheelEvent),
            {
               passive: false,
            },
         );
      }
   }

   subscribeListOnScroll(list: HTMLDivElement | null): void {
      if (this.unsubscribeListOnScroll) {
         this.unsubscribeListOnScroll();
         this.unsubscribeListOnScroll = null;
      }
      if (list) {
         this.unsubscribeListOnScroll = addEventListenerWithOptions(list, "scroll", () => this.onListScroll(), {
            passive: false,
         });
      }
   }

   submitOnEnter(e: React.KeyboardEvent): void {
      let instance = this.props.instance.parent;
      while (instance) {
         let htmlInstance = instance as HtmlElementInstance;
         if (htmlInstance.events && htmlInstance.events.onSubmit) {
            htmlInstance.events.onSubmit(e, instance);
            break;
         } else {
            instance = instance.parent;
         }
      }
   }
}
