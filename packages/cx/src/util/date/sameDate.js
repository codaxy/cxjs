export function sameDate (d1, d2) {
   return d1.getDate() == d2.getDate()
      && d1.getMonth() == d2.getMonth()
      && d1.getYear() == d2.getYear();
}
