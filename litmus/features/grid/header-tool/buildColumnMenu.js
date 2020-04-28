import { isString, isObject } from "util";
import { TextField, NumberField, DateField, Menu, Submenu, Icon } from "cx/widgets";
import { getSearchQueryPredicate, Format } from "cx/util";
import { computable } from "cx/ui";

const defaultDebounceTimeout = 400;

function getTextFilter(field, filterPath, format) {
   return {
      predicate: (filterParams) => {
         let filter = filterParams[field];
         if (!filter || filter.value == null) return null;
         let search = getSearchQueryPredicate(filter.value);
         let formatter = Format.parse(format || "s");
         return (record) => record[field] != null && search(formatter(record[field]));
      },
      menu: (
         <cx>
            <TextField
               mod="menu"
               placeholder="Search..."
               reactOn="change enter blur"
               value={{ bind: filterPath + ".value", debounce: defaultDebounceTimeout }}
               showClear
            />
         </cx>
      ),
   };
}

function getNumberFilter(field, filterPath, format) {
   let exactPath = filterPath + ".exact";
   let rangePath = filterPath + ".range";

   return {
      predicate: (filterParams) => {
         let filter = filterParams[field];
         if (!filter) return null;
         let filters = [];
         if (filter.exact != null) filters.push((record) => record[field] == filter.exact);
         if (filter.range && filter.range.from != null) filters.push((record) => record[field] >= filter.range.from);
         if (filter.range && filter.range.to != null) filters.push((record) => record[field] <= filter.range.to);
         return filters;
      },
      menu: (
         <cx>
            <Submenu
               text="Exact"
               arrow
               checked={{
                  get: computable(exactPath, isNonEmptyObjectDeep),
                  set: (value, { store }) => {
                     if (!value) store.delete(exactPath);
                  },
               }}
            >
               <Menu putInto="dropdown">
                  <NumberField
                     mod="menu"
                     placeholder="Value..."
                     value={{ bind: exactPath, debounce: defaultDebounceTimeout }}
                     showClear
                  />
               </Menu>
            </Submenu>
            <Submenu
               text="Range"
               arrow
               checked={{
                  get: computable(rangePath, isNonEmptyObjectDeep),
                  set: (value, { store }) => {
                     if (!value) store.delete(rangePath);
                  },
               }}
            >
               <Menu putInto="dropdown">
                  <NumberField
                     mod="menu"
                     placeholder="From..."
                     value={{ bind: rangePath + ".from", debounce: defaultDebounceTimeout }}
                     showClear
                  />
                  <NumberField
                     mod="menu"
                     placeholder="To..."
                     value={{ bind: rangePath + ".to", debounce: defaultDebounceTimeout }}
                     showClear
                  />
               </Menu>
            </Submenu>
         </cx>
      ),
   };
}

function getDateFilter(field, filterPath, format) {
   let exactPath = filterPath + ".exact";
   let rangePath = filterPath + ".range";

   return {
      predicate: (filterParams) => {
         let filter = filterParams[field];
         if (!filter) return null;
         let filters = [];
         if (filter.exact != null) {
            let v = new Date(filter.exact).valueOf();
            filters.push((record) => new Date(record[field]).valueOf() == v);
         }
         if (filter.range && filter.range.from != null) {
            let v = new Date(filter.range.from).valueOf();
            filters.push((record) => new Date(record[field]).valueOf() >= v);
         }
         if (filter.range && filter.range.to != null) {
            let v = new Date(filter.range.to).valueOf();
            filters.push((record) => new Date(record[field]).valueOf() <= v);
         }
         return filters;
      },
      menu: (
         <cx>
            <Submenu
               text="Exact"
               arrow
               checked={{
                  get: computable(exactPath, isNonEmptyObjectDeep),
                  set: (value, { store }) => {
                     if (!value) store.delete(exactPath);
                  },
               }}
            >
               <Menu putInto="dropdown">
                  <DateField mod="menu" placeholder="Value..." value-bind={exactPath} showClear />
               </Menu>
            </Submenu>
            <Submenu
               text="Range"
               arrow
               checked={{
                  get: computable(rangePath, isNonEmptyObjectDeep),
                  set: (value, { store }) => {
                     if (!value) store.delete(rangePath);
                  },
               }}
            >
               <Menu putInto="dropdown">
                  <DateField mod="menu" placeholder="From..." value-bind={rangePath + ".from"} showClear />
                  <DateField mod="menu" placeholder="To..." value-bind={rangePath + ".to"} showClear />
               </Menu>
            </Submenu>
         </cx>
      ),
   };
}

function buildColumnMenu(column, state, options) {
   let result = { ...column };

   if (isString(result.header)) result.header = { text: result.header };

   if (!result.header) result.header = {};

   let filterPath = `${options.filterPath}.${column.field}`;

   state.filterParams[column.field] = { bind: filterPath };

   let filter;
   if (column.type == "date") filter = getDateFilter(column.field, filterPath, column.format);
   else if (column.type == "number") filter = getNumberFilter(column.field, filterPath, column.format);
   else filter = getTextFilter(column.field, filterPath, column.format);

   let { menu, predicate } = filter;

   state.filters.push(predicate);

   result.header.className = getClassNameObject(result.header.className);

   result.header.className["cxs-filtered"] = computable(filterPath, isNonEmptyObjectDeep);

   result.header.tool = (
      <cx>
         <Menu horizontal itemPadding="small">
            <Submenu placement="down-left">
               <span style="padding: 4px">
                  <Icon name="search" />
               </span>
               <Menu putInto="dropdown">
                  <Submenu
                     text="Filter"
                     checked={{
                        get: computable(filterPath, isNonEmptyObjectDeep),
                        set: (value, { store }) => {
                           if (!value) store.delete(filterPath);
                        },
                     }}
                     arrow
                  >
                     <Menu putInto="dropdown">{menu}</Menu>
                  </Submenu>
               </Menu>
            </Submenu>
         </Menu>
      </cx>
   );

   return result;
}

export function buildColumnMenus(columns, options) {
   let filters = [],
      filterParams = {};

   columns = columns.map((column) => buildColumnMenu(column, { filterParams, filters }, options));

   return {
      columns,
      filterParams,
      onCreateFilter: (filterParams) => {
         let conditions = filters.flatMap((f) => f(filterParams)).filter((f) => !!f);
         if (conditions.length == 0) return () => true;
         return (record) => conditions.every((c) => c(record));
      },
   };
}

function getClassNameObject(x) {
   if (isString(x)) {
      let parts = x.split(" ");
      let result = {};
      parts.forEach((p) => {
         if (p) result[p] = true;
      });
      return result;
   }
   return x || {};
}

export function isNonEmptyObjectDeep(o) {
   if (o == null) return false;
   if (isObject(o)) {
      for (let k in o) {
         if (isNonEmptyObjectDeep(o[k])) return true;
      }
      return false;
   }
   return true;
}
