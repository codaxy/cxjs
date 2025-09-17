//@ts-nocheck
function pad(num) {
   const norm = Math.floor(Math.abs(num));
   return (norm < 10 ? "0" : "") + norm;
}

export function encodeDate(date) {
   return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}
