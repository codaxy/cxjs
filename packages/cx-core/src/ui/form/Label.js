import {Widget, VDOM} from '../Widget';

const focus = (id) => {
   var el = id && document.getElementById(id);
   if (el)
      el.focus();
}

export function Label(key, text, id, options = {}) {
   if (!text)
      return null;
   return <label key={key}
                 className="cxb-label"
                 style={options.style}
                 htmlFor={id}
                 onClick={e => focus(id)}>
      {text}
   </label>
}