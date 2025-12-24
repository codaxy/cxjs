/** @jsxImportSource react */
import { Widget, VDOM, WidgetStyleConfig } from "../../ui/Widget";
import { KeyCode } from "../../util/KeyCode";
import { preventFocusOnTouch } from "../../ui/FocusManager";
import ForwardIcon from "../icons/forward";
import { NumberProp } from "../../ui/Prop";
import { StyledContainerConfig } from "../../ui/Container";
import { Instance } from "../../ui/Instance";
import { RenderingContext } from "../../ui/RenderingContext";

export interface PaginationConfig extends StyledContainerConfig {
   /** Current page number. */
   page?: NumberProp;

   /** Total number of pages. */
   pageCount?: NumberProp;

   /** Number of page buttons to display. */
   length?: NumberProp;
}

export class Pagination extends Widget<PaginationConfig> {
   declare baseClass: string;
   declare length: number;

   constructor(config?: PaginationConfig) {
      super(config);
   }

   declareData() {
      super.declareData(
         {
            page: undefined,
            length: undefined,
            pageCount: undefined,
         },
         ...arguments,
      );
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      let { data } = instance;
      let { page, pageCount, length } = data;
      let { CSS, baseClass } = this;

      if (!pageCount) pageCount = 1;

      let minPage = Math.max(1, page - Math.floor(length / 2));
      let maxPage = minPage + length - 1;

      if (maxPage > pageCount) {
         maxPage = Math.max(pageCount, length);
         minPage = maxPage - length + 1;
      }

      let nextPageIcon = <ForwardIcon className={CSS.element(baseClass, "icon-next-page")} />;
      let prevPageIcon = <ForwardIcon className={CSS.element(baseClass, "icon-prev-page")} />;

      let pageBtns = [];

      for (let p = minPage - 1; p <= maxPage + 1; p++) {
         pageBtns.push(
            <li
               key={p < minPage ? "-1" : p > maxPage ? "-2" : p}
               className={CSS.element(baseClass, "page", {
                  active: page == p,
                  disabled:
                     (p <= maxPage && p > pageCount) ||
                     (p < minPage && page == 1) ||
                     (p > maxPage && page + 1 > pageCount),
               })}
               onMouseDown={(e) => {
                  e.stopPropagation();
                  preventFocusOnTouch(e);
               }}
               onClick={(e) => {
                  this.setPage(e, instance, p < minPage ? page - 1 : p > maxPage ? page + 1 : p);
               }}
            >
               {p < minPage ? prevPageIcon : p > maxPage ? nextPageIcon : p}
            </li>,
         );
      }

      return (
         <ul
            key={key}
            className={data.classNames}
            style={data.style}
            tabIndex={0}
            onKeyDown={(e) => {
               this.onKeyDown(e, instance);
            }}
         >
            {pageBtns}
         </ul>
      );
   }

   onKeyDown(e: React.KeyboardEvent, instance: Instance) {
      let { data } = instance;
      switch (e.keyCode) {
         case KeyCode.left:
            this.setPage(e, instance, data.page - 1);
            break;

         case KeyCode.right:
            this.setPage(e, instance, data.page + 1);
            break;
      }
   }

   setPage(e: React.SyntheticEvent, instance: Instance, page: number) {
      e.preventDefault();
      e.stopPropagation();
      let { data } = instance;
      let { pageCount } = data;
      if (page <= pageCount && page > 0) instance.set("page", page);
   }
}

Pagination.prototype.baseClass = "pagination";
Pagination.prototype.length = 5;
Pagination.prototype.styled = true;

Widget.alias("pagination", Pagination);
