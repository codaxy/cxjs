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
   document.body.appendChild(errorEl);
}
