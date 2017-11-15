import {Expression, computable} from 'cx/data';

let stringExpr = Expression.compile("{person.firstName} + ' ' + {person.lastName}");
let computableExpr = computable('person.firstName', 'person.lastName', (fn, ln ) => fn + ' ' + ln).memoize();
let getExpr = Expression.compile(get => get('person.firstName') + ' ' + get('person.lastName'));
//let getProxyExpr = Expression.compile(d => d.person.firstName + ' ' + d.person.lastName);
let rawExpr = d => d.person.firstName + ' ' + d.person.lastName;

let stringExprSum = Expression.compile("{a} + {b}");
let computableExprSum = computable('a', 'b', (a, b ) => a + b).memoize();
let getExprSum = Expression.compile(get => get('a') + get('b'));
//let getProxySum = Expression.compile(d => d.a + d.b);
let rawExprSum = d => d.a + d.b;


var suite = new Benchmark.Suite;
suite
   .add('raw expression - string concat', () => { rawExpr({ person: { firstName: 'John', lastName: 'Doe'  }}) })
   .add('string expression - string concat', () => { stringExpr({ person: { firstName: 'John', lastName: 'Doe'  }}) })
   .add('computable  - string concat', () => { computableExpr({ person: { firstName: 'John', lastName: 'Doe'  } }) })
   .add('get based expression  - string concat', () => { getExpr({ person: { firstName: 'John', lastName: 'Doe'  } }) })
   //.add('proxy based expression  - string concat', () => { getProxyExpr({ person: { firstName: 'John', lastName: 'Doe'  } }) })
   .add('raw expression - sum', () => { rawExprSum({ a: 5, b: 10 }) })
   .add('string expression - sum', () => { stringExprSum({ a: 5, b: 10 }) })
   .add('computable  - sum', () => { computableExprSum({ a: 5, b: 10 }) })
   .add('get based expression  - sum', () => { getExprSum({ a: 5, b: 10 }) })
   //.add('proxy based expression  - sum', () => { getProxySum({ a: 5, b: 10 }) })
   .add('raw expression - sum - random', () => { rawExprSum({ a: Math.random(), b: Math.random() }) })
   .add('string expression - sum - random', () => { stringExprSum({ a: Math.random(), b: Math.random() }) })
   .add('computable  - sum - random', () => { computableExprSum({ a: Math.random(), b: Math.random() }) })
   .add('get based expression  - sum - random', () => { getExprSum({ a: Math.random(), b: Math.random() }) })
   //.add('proxy based expression  - sum - random', () => { getProxySum({ a: Math.random(), b: Math.random() }) })

export default suite;