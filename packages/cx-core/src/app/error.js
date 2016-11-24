import "./error.scss";

export function hideError() {
   var errors = document.getElementsByClassName('cxb-apperror');
   for (var i = 0; i<errors.length; i++)
      document.body.removeChild(errors[i]);
}

export function showError(errorText) {
   var errorEl = document.createElement('div');
   errorEl.innerText = errorText;
   errorEl.className = 'cxb-apperror';

   var close = document.createElement('a');
   close.innerHTML = '&times;';
   errorEl.appendChild(close);
   errorEl.onclick = (e) => {
      e.preventDefault();
      window.location.reload();
   };
   document.body.appendChild(errorEl);
}
