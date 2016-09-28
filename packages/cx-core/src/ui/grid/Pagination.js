import {Widget, VDOM} from '../Widget';
import {KeyCode} from '../../util/KeyCode';

export class Pagination extends Widget {

   declareData() {
      super.declareData({
         page: undefined,
         length: undefined,
         pageCount: undefined,
         class: {
            structured: true
         },
         className: {
            structured: true
         },
         style: {
            structured: true
         }
      }, ...arguments);
   }

   render(context, instance, key) {
      return <PaginationComponent key={key} instance={instance} onSetPage={(e, page)=>{this.onSetPage(e, instance, page)}} />
   }

   onSetPage(e, instance, page) {
      var {data} = instance;
      var {pageCount} = data;
      if (page <= pageCount && page > 0)
         instance.set('page', page);
      e.preventDefault();
      e.stopPropagation();
   }
}

Pagination.prototype.baseClass = "pagination";
Pagination.prototype.length = 5;

Widget.alias('pagination', Pagination);

export class PaginationComponent extends VDOM.Component {
   render() {
      var {data, widget} = this.props.instance;
      var {page, pageCount, length} = data;
      var {CSS, baseClass} = widget;

      if (!pageCount)
         pageCount = 1;

      var minPage = Math.max(1, page - Math.floor(length / 2));
      var maxPage = minPage + length -1;

      var pageBtns = [];

      this.pageRefs = {};

      for (let p = minPage-1; p <= maxPage+1; p++) {
         pageBtns.push(<li key={p < minPage ? '-1' : p > maxPage ? '-2' : p}
                           ref={c=>{this.pageRefs[p] = c;}}
                           className={CSS.element(baseClass, "page", { active: page == p, disabled: p > pageCount || (p < page && page == 1) })}
                           tabIndex={p==page ? 0 : -1}
                           onKeyDown={e=>this.onKeyDown(e, p)}
                           onMouseDown={e=> {e.stopPropagation(); e.preventDefault();}}
                           onClick={e=>this.props.onSetPage(e, p < minPage ? page - 1 : p > maxPage ? page + 1 : p)}>
            {p < minPage ? '\u00ab' : p > maxPage ? '\u00bb' : p}
         </li>)
      }

      return <ul className={data.classNames} style={data.style}>
         {pageBtns}
      </ul>;
   }

   onKeyDown(e, page) {
      switch (e.keyCode) {
         case KeyCode.enter:
            this.props.onSetPage(e, page);
            break;

         case KeyCode.left:
            var el = this.pageRefs[page - 1];
            if (el)
               el.focus();
            e.preventDefault();
            e.stopPropagation();
            break;

         case KeyCode.right:
            var el = this.pageRefs[page + 1];
            if (el)
               el.focus();
            e.preventDefault();
            e.stopPropagation();
            break;
      }
   }
}