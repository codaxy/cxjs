function pad(num: number): string {
   const norm = Math.floor(Math.abs(num));
   return (norm < 10 ? "0" : "") + norm;
}

export function encodeDate(date: Date): string {
   return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
}
