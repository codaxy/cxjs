import {Expression, computable} from 'cx/data';

let stringExpr = Expression.get("{person.firstName} + ' ' + {person.lastName}");
let computableExpr = computable('person.firstName', 'person.lastName', (fn, ln ) => fn + ' ' + ln);
let getExpr = Expression.get(get => get('person.firstName') + ' ' + get('person.lastName'));

let stringExprSum = Expression.get("{a} + {b}");
let computableExprSum = computable('a', 'b', (a, b ) => a + b);
let getExprSum = Expression.get(get => get('a') + get('b'));


var suite = new Benchmark.Suite;
suite
   .add('string expressions - string concat', () => { stringExpr({ firstName: 'John', lastName: 'Doe' }) })
   .add('computable  - string concat', () => { computableExpr({ firstName: 'John', lastName: 'Doe' }) })
   .add('get based expressions  - string concat', () => { getExpr({ firstName: 'John', lastName: 'Doe' }) })
   .add('string expressions - sum', () => { stringExprSum({ a: 5, b: 10 }) })
   .add('computable  - sum', () => { computableExprSum({ a: 5, b: 10 }) })
   .add('get based expressions  - sum', () => { getExprSum({ a: 5, b: 10 }) })
   .add('string expressions - sum - random', () => { stringExprSum({ a: Math.random(), b: Math.random() }) })
   .add('computable  - sum - random', () => { computableExprSum({ a: Math.random(), b: Math.random() }) })
   .add('get based expressions  - sum - random', () => { getExprSum({ a: Math.random(), b: Math.random() }) })

export default suite;