//https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript

function pad(num) {
   const norm = Math.floor(Math.abs(num));
   return (norm < 10 ? '0' : '') + norm;
}

export function encodeDateWithTimezoneOffset(date) {
   const tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-';
   return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(tzo / 60) +
      ':' + pad(tzo % 60);
}